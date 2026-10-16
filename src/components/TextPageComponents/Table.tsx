// Define types for the table props
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  isDarkMode?: boolean;
}

// Default key extractor
const defaultKeyExtractor = (_: unknown, index: number): string =>
  `row-${index}`;

// Reusable Table Component
export default function Table<T>({
  columns,
  data,
  keyExtractor = defaultKeyExtractor,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  isDarkMode = true,
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr
            className={`${
              isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            } ${headerClassName}`}
          >
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-3 text-left font-semibold ${
                  column.width ? `w-[${column.width}]` : "w-auto"
                } ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className={`${
                isDarkMode
                  ? index % 2 === 0
                    ? "bg-gray-900 text-white"
                    : "bg-gray-800 text-white"
                  : index % 2 === 0
                    ? "bg-white text-gray-800"
                    : "bg-gray-100 text-gray-800"
              } ${rowClassName}`}
            >
              {columns.map((column) => (
                <td
                  key={`${column.key}-${index}`}
                  className={`p-3 border border-gray-700 ${
                    isDarkMode ? "border-gray-700" : "border-gray-300"
                  } ${cellClassName} ${column.className || ""}`}
                >
                  {column.render
                    ? column.render(item, index)
                    : ((item as Record<string, unknown>)[
                        column.key
                      ] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
