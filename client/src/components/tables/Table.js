import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { getValues } from "../../actions/valuesAction";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  {
    id: "ticker",
    label: "Ticker",
    minWidth: 170
  },
  {
    id: "opt_type",
    label: "Option Type",
    minWidth: 100,
    align: "center"
  },
  {
    id: "strike",
    label: "Strike",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  },
  {
    id: "expiry",
    label: "Expiry",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  },
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  },
  {
    id: "qty",
    label: "Quantity",
    minWidth: 100,
    align: "center",
    format: value => value.toLocaleString()
  }
  /*{{
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: value => value.toFixed(2)
  }}*/
];

function createData(ticker, opt_type, strike, expiry, price, qty) {
  return { ticker, opt_type, strike, expiry, price, qty };
}

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // const options
  const optionsState = React.useState([]);

  // Get state values
  const values = useSelector(state => state.values);
  const dispatch = useDispatch();
  React.useEffect(() => {
    console.log("VALUES", values.values);
    // optionsState.push(values)
    // console.log("VALUES State", optionsState)
  });

  // Table values here
  const rowss = [
    createData("values", "PE", 102, "10/06/19", 4, -2),
    createData("BANKIFTY", "PE", 102, "10/06/19", 4, -2),
    createData("BANKIFTY", "PE", 102, "10/06/19", 4, -2),
    createData("BANKIFTY", "PE", 102, "10/06/19", 4, -2),
    createData("BANKIFTY", "PE", 102, "10/06/19", 4, -2)
  ];

  const rows = [];
  if (values.values.length > 0) {
    values.values[2].map(data => {
      const ticker = "BANKNIFTY";
      let opt_type = "";
      if (data[1] === "call_ask") {
        opt_type = "CE";
      }
      if (data[1] === "call_bid") {
        opt_type = "CE";
      }
      if (data[1] === "puts_ask") {
        opt_type = "PE";
      }
      if (data[1] === "puts_bid") {
        opt_type = "PE";
      }

      const strike = data[0].strike;
      const expiry = data[0].expiry;
      let price = 0;
      if (data[1] === "call_ask") {
        price -= data[0].call_ask;
      }
      if (data[1] === "call_bid") {
        price += data[0].call_bid;
      }
      if (data[1] === "puts_ask") {
        price -= data[0].puts_ask;
      }
      if (data[1] === "puts_bid") {
        price += data[0].puts_bid;
      }
      const qty = 2;

      rows.push({
        ticker,
        opt_type,
        strike,
        expiry,
        price,
        qty
      });
    });
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container} id="positions_tasks_tables">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="positions_tasks_table">
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
