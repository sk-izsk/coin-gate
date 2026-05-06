import { cn } from '../utils/utils'
import { Table } from './ui/table'

export const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  bodyRowClassName,
  bodyCellClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={cn('custom-scrollbar', tableClassName)}>
      <Table.Header className={headerClassName}>
        <Table.Row className={cn('hover:bg-transparent!', headerRowClassName)}>
          {columns.map((column, i) => (
            <Table.Head
              key={i}
              className={cn(
                'bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5',
                headerCellClassName,
                column.headClassName,
              )}
            >
              {column.header}
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row, rowIndex) => (
          <Table.Row
            key={rowKey(row, rowIndex)}
            className={cn(
              'overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30! relative',
              bodyRowClassName,
            )}
          >
            {columns.map((column, columnIndex) => (
              <Table.Cell
                key={columnIndex}
                className={cn('py-4 first:pl-5 last:pr-5', bodyCellClassName, column.cellClassName)}
              >
                {column.cell(row, rowIndex)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
