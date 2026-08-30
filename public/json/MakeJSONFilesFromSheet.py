# pip install gspread

import json
import os
import re

import gspread

SPREADSHEET_ID = "1rj8eEdbHBlXsfaX9SepSxknKQ26-ZqLBvH_bKkpsvaI"
CREDENTIALS_FILE = r"C:/Users/Edvin/Documents/GoogleAPI/GoogleAPI.json"
BUILD_DIR = "build"

ACTION_ICONS = {
    "1": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/OneAction.png" alt="1 Action"/>',
    "2": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/TwoActions.png" alt="2 Actions"/>',
    "3": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/ThreeActions.png" alt="3 Actions"/>',
    "Reaction": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/Reaction.png" alt="Reaction Symbol"/>',
    "0": '<img class="action-icon-modalList" src="/images/Kastorix/Icons/FreeAction.png" alt="Free Action"/>',
}

SHEETS = [
    "General Feats",
    "Arcane Feats",
    "Advantages",
    "Ancestry Feats",
    "Backgrounds",
    "Species",
    "Spells",
    "Metamagic",
    "Weapons",
    "Weapon Traits",
    "Combat Maneuvers",
    "Actions",
    "Armors",
    "Golem Models",
    "Runegun Upgrades",
    "Golem Upgrades",
    "Potions",
    "Gadgets",
    "Runes",
    "Skills",
    "Conditions",
    "Damage Types",
    "Aspects",
]

SHEET_CONFIGS = []


def is_blank(cell):
    return cell is None or str(cell).strip() == ""


def trim_row(row):
    row = list(row)
    while row and is_blank(row[-1]):
        row.pop()
    return row


def clean_rows(values):
    cleaned = []
    for row in values:
        row = trim_row(row)
        if row and any(not is_blank(cell) for cell in row):
            cleaned.append(row)
    return cleaned


def ensure_length(row, length):
    if len(row) >= length:
        return row
    return row + [""] * (length - len(row))


def replace_action_numbers(value):
    """
    Replace exact action values with HTML icons.

    If you need the old substring-replacement behavior, replace this with:

    text = str(value or "")
    for key, icon in ACTION_ICONS.items():
        text = text.replace(key, icon)
    return text
    """
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        try:
            if float(value).is_integer():
                value = int(value)
        except (TypeError, ValueError):
            pass

    text = "" if value is None else str(value).strip()
    return ACTION_ICONS.get(text, text)


def export_mapped(values, config):
    """
    Export a sheet using the configured column mapping and category bucket.

    Output shape:
    {
      "Category": [
        {
          "name": "...",
          "description": "..."
        }
      ]
    }
    """
    rows = clean_rows(values)[1:]  # Skip first row, assuming it is the header row.

    categories = config["categories"]
    grouped = {category: [] for category in categories}

    mapping = config["mapping"]
    required_length = max([config["category_column_index"]] + list(mapping.values())) + 1

    for row in rows:
        row = ensure_length(row, required_length)

        item = {}
        for key, index in mapping.items():
            value = row[index]

            if key == "actions":
                value = replace_action_numbers(value)

            item[key] = value

        category = row[config["category_column_index"]]
        category = "" if category is None else str(category).strip()

        if category not in grouped:
            category = categories[0]

        grouped[category].append(item)

    return grouped


def export_raw(values):
    """
    Export a sheet as a plain JSON array using the first row as headers.

    Output shape:
    [
      {
        "Column A": "...",
        "Column B": "..."
      }
    ]
    """
    rows = clean_rows(values)

    if not rows:
        return []

    max_len = max(len(row) for row in rows)
    header = ensure_length(rows[0], max_len)

    headers = []
    for i, value in enumerate(header):
        name = str(value).strip() if value is not None else ""
        if not name:
            name = f"col_{i}"

        base = name
        suffix = 2
        while name in headers:
            name = f"{base}_{suffix}"
            suffix += 1

        headers.append(name)

    items = []
    for row in rows[1:]:
        row = ensure_length(row, len(headers))
        items.append({headers[i]: row[i] for i in range(len(headers))})

    return items


def slugify_sheet_name(name):
    return re.sub(r"[^0-9a-zA-Z]+", "_", name).strip("_").lower()


def save_json(data, filename):
    path = os.path.join(BUILD_DIR, filename)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    if isinstance(data, list):
        print(f"Wrote {path} ({len(data)} rows)")
    elif isinstance(data, dict):
        total = sum(len(value) for value in data.values() if isinstance(value, list))
        print(f"Wrote {path} ({total} rows)")
    else:
        print(f"Wrote {path}")


if __name__ == "__main__":
    os.makedirs(BUILD_DIR, exist_ok=True)

    try:
        client = gspread.service_account(filename=CREDENTIALS_FILE)
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
    except Exception as exc:
        raise SystemExit(f"Could not open spreadsheet: {exc}")

    config_by_sheet = {config["sheet_name"]: config for config in SHEET_CONFIGS}

    for sheet_name in SHEETS:
        try:
            worksheet = spreadsheet.worksheet(sheet_name)
            values = worksheet.get_all_values()
        except Exception as exc:
            print(f"Could not fetch sheet '{sheet_name}': {exc}")
            continue

        try:
            config = config_by_sheet.get(sheet_name)

            if config:
                output = export_mapped(values, config)
                filename = config["file"]
            else:
                output = export_raw(values)
                filename = f"{slugify_sheet_name(sheet_name)}.json"

            save_json(output, filename)

        except Exception as exc:
            print(f"Failed to export sheet '{sheet_name}': {exc}")