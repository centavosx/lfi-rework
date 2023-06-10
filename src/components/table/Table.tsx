import {
  useState,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import {
  Checkbox,
  MenuItem,
  OutlinedInput,
  Select,
  TableHead,
} from '@mui/material'
import { format } from 'date-fns'
import { Flex, Text } from 'rebass'
import { Input, SearchableInput } from 'components/input'
import { Button } from 'components/button'
import { Loading } from 'components/loading'

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page == 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page == 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

type TableProps<T extends object = any> = {
  dataRow: T[]
  dataCols: {
    field?: keyof T
    sub?: string
    name: string
    isNumber?: boolean
    items?: { itemValues: string[]; onChange: (v: string) => void }
    custom?: (data: T, i: number) => ReactNode
  }[]
  isCheckboxEnabled?: boolean
  rowIdentifierField: keyof T
  page: number
  pageSize: number
  total: number
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleChangePage?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void
  onRowClick?: (data: T) => void
  children:
    | ((
        selected: any[],
        setSelected: Dispatch<SetStateAction<any[]>>
      ) => ReactNode)
    | ReactNode
    | undefined
}

const SearchInputField = ({ onSearch }: { onSearch?: (v: string) => void }) => {
  return (
    <Flex
      p={10}
      alignItems={'end'}
      sx={{ gap: 10, alignItems: 'center', justifyContent: 'center' }}
    >
      <SearchableInput
        placeHolder="Search..."
        sx={{
          div: {
            input: {
              padding: 2,
            },
          },
        }}
        onSearch={async (v) => await onSearch?.(v)}
      />
    </Flex>
  )
}

export function CustomTable<T extends object = any>({
  dataRow,
  dataCols,
  isCheckboxEnabled,
  rowIdentifierField,
  page,
  pageSize,
  total,
  isFetching,
  handleChangeRowsPerPage,
  handleChangePage,
  onRowClick,
  onSearch,

  children,
}: TableProps<T> & { onSearch?: (v: string) => void; isFetching?: boolean }) {
  const [selected, setSelected] = useState<any[]>([])

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(dataRow.map((d) => d[rowIdentifierField]))
        return
      }
      setSelected([])
    },
    [setSelected, dataRow, rowIdentifierField]
  )

  const handleCheckClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
      if (event.target.checked) {
        return setSelected((d) => [...d, data])
      }
      return setSelected((d) => d.filter((v) => v !== data))
    },
    [setSelected]
  )

  return (
    <TableContainer component={Paper}>
      {typeof children === 'function'
        ? children(selected, setSelected)
        : children}
      <SearchInputField onSearch={onSearch} />
      <Table
        sx={{ minWidth: 500, position: 'relative' }}
        aria-label="custom pagination table"
        stickyHeader={true}
      >
        <TableHead>
          <TableRow>
            {isCheckboxEnabled && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={
                    selected.length > 0
                      ? selected.length === dataRow.length
                      : false
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
            )}
            {dataCols.map((head) => (
              <TableCell
                key={head.field as string}
                align={head.isNumber ? 'right' : 'left'}
              >
                {!!head.items ? (
                  <Select
                    displayEmpty
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected !== null) {
                        return head.name
                      }

                      return selected
                    }}
                    sx={{
                      div: {
                        padding: '2.5px',
                        borderColor: 'transparent',
                      },
                      fieldset: {
                        border: 0,
                        borderColor: 'transparent',
                      },
                      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      lineHeight: '1.5rem',
                      letterSpacing: '0.01071em',
                    }}
                    onChange={(v) =>
                      head.items?.onChange((v?.target?.value ?? '') as string)
                    }
                  >
                    {head.items.itemValues.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  head.name
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataRow.map((row, i) => (
            <TableRow
              key={i}
              hover={true}
              style={{ cursor: !!onRowClick ? 'pointer' : undefined }}
            >
              {isCheckboxEnabled && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected.includes(row[rowIdentifierField])}
                    onChange={(e) =>
                      handleCheckClick(e, row[rowIdentifierField])
                    }
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </TableCell>
              )}
              {dataCols.map((d, k) => (
                <TableCell
                  key={k}
                  component="th"
                  scope="row"
                  onClick={() => onRowClick?.(row)}
                  sx={{ width: d?.field === 'id' ? 320 : undefined }}
                >
                  {!!d.field
                    ? !!d.sub
                      ? d.sub === 'date'
                        ? !!(row[d.field] as any)?.[d.sub]
                          ? format(
                              new Date((row[d.field] as any)?.[d.sub]),
                              'cccc LLLL d, yyyy'
                            )
                          : null
                        : (row[d.field] as any)?.[d.sub]
                      : d.field === 'date'
                      ? !!row[d.field]
                        ? format(
                            new Date(row[d.field] as any),
                            'cccc LLLL d, yyyy'
                          )
                        : null
                      : row[d.field]
                    : d?.custom?.(dataRow[i], i)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell sx={{ width: 160, maxWidth: 180, position: 'absolute' }}>
              <Text alignSelf={'center'} width={'100%'}>
                Total Items: {total}
              </Text>
            </TableCell>
            <TablePagination
              rowsPerPageOptions={[1, 20, 50, 100]}
              count={total}
              rowsPerPage={pageSize}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={(e, p) => handleChangePage?.(e, p)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
        {isFetching && <Loading />}
      </Table>
    </TableContainer>
  )
}
