import { Text, Title } from '@/ui'

import { CodeBlock } from './CodeBlock'

interface InsideDocsProps {
  title: string
  content: string
  description: string
  tableContent?: {
    headers: string[]
    rows: string[][]
  }
}

export const InsideDocs: React.FC<InsideDocsProps> = ({
  title,
  description,
  content,
  tableContent,
}) => {
  return (
    <aside className="hidden p-6 w-[29rem] bg-gray-700 overflow-x-hidden overflow-y-auto lg:block">
      <Title level={3} className="mb-6">
        {title}
      </Title>

      <Text className="mb-6">{description}</Text>

      <CodeBlock lang="js">{content.trim()}</CodeBlock>

      {tableContent && (
        <table className="w-full table-auto border-collapse rounded">
          <thead className="bg-gray-800">
            <tr>
              {tableContent.headers.map(header => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-6 text-left uppercase text-xs font-medium text-white tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableContent.rows.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'}
              >
                {row.map((cell, idx) => (
                  <td
                    key={idx}
                    className="px-6 py-4 whitespace-nowrap text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </aside>
  )
}
