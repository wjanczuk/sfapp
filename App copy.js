import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//add checkbox to header, which selects/deselects all rows
//add checkbox to each individual row
//add functionality to the buttons -- add debt adds a row, remove debt removes a row
//i. Please display the number of rows that have been checked (Check Row Count).
//ii. Please calculate the Total Row Count in the table.
//iii. Please calculate the Balance which is the sum of all the rows that have been checked.

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // setAllSelected(() => {
  //   if (allSelected) {
  //     items.map(item => item.checked = false)
  //   } else {
  //     items.map(item => item.checked = true)
  //   }
  // })

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  console.log('items-->', items)

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <div className="banksTable">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <form>
                    <input
                      name="selectAll"
                      type="checkbox"
                      checked={!!allSelected}
                      onChange={setAllSelected}
                    />
                  </form>
                </th>
                <th>Creditor</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Min Pay%</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <input
                      name={item.id}
                      type="checkbox"
                      checked={!!item.checked}
                      onChange={() => {
                        const currentItemIndex = items.filter((v) => v.id === item.id);
                        items[currentItemIndex].checked = !items[currentItemIndex].checked;
                      }}
                    />
                  </td>
                  <td>{item.creditorName}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.minPaymentPercentage.toFixed(2)}%</td>
                  <td>{item.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="tableButtons">
          <button>Add Debt</button> <button>Remove Debt(s)</button>
        </div>
        <div className="balanceTotal">
            
        </div>
        <div className="rowCounts">
        </div>
      </div>
    );
  }
}

export default App;

//checked={this.state.isGoing}
//onChange={this.handleInputChange}

// <CheckBox
// 											right
// 											checkedColor='#2a9d8f'
// 											uncheckedColor='#2a9d8f'
// 											containerStyle={{backgroundColor: '#ffffff', width: 30, height: 50}}
// 											checked={!!item.checked}
// 											onPress={() => {
// 												const items = [...this.state.restaurantList.results];
// 												const currentItemIndex = items.findIndex(
// 													(v) => v.place_id === item.place_id
// 												);
// 												items[currentItemIndex].checked = !items[
// 													currentItemIndex
// 												].checked;
// 												this.setState((state) => ({ ...state, items }));
// 
// 											}}
// 									/>