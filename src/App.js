import React from 'react';
import Table from 'react-bootstrap/Table';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      allSelected: false,
      newItemInProgress: false,
      idInProgress: 11,
      creditorInProgress: '',
      firstNameInProgress: '',
      lastNameInProgress: '',
      minPayInProgress: 0,
      balanceInProgress: 0
    };
    this.addDebt = this.addDebt.bind(this);
    this.saveDebt = this.saveDebt.bind(this);
    this.removeDebt = this.removeDebt.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleSelectOne = this.handleSelectOne.bind(this);
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  addDebt() {
    this.setState((state) => ({...state, newItemInProgress: true}))
  }

  saveDebt() {
    let newItem = {
      id: this.state.idInProgress,
      creditorName: this.state.creditorInProgress,
      firstName: this.state.firstNameInProgress,
      lastName: this.state.lastNameInProgress,
      minPaymentPercentage: this.state.minPayInProgress,
      balance: this.state.balanceInProgress
    }
    this.setState((state) => ({...state, 
      items: [...this.state.items, newItem], 
      newItemInProgress: false,
      idInProgress: this.state.idInProgress + 1,
      creditorInProgress: '',
      firstNameInProgress: '',
      lastNameInProgress: '',
      minPayInProgress: 0,
      balanceInProgress: 0}));
  }

  removeDebt() {
    let newItems = this.state.items.filter(item => item.checked !== true);
    this.setState((state) => ({...state, items: newItems}));
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSelectAll() {
    const items = [...this.state.items];
    if (this.state.allSelected) items.map(item => item.checked = false);
    else items.map(item => item.checked = true);
    this.setState((state) => ({...state, items: items, allSelected: !this.state.allSelected}));
  }

  handleSelectOne(itemId) {
    const items = [...this.state.items];
    const currentItemIndex = items.findIndex((v) => v.id === itemId);
    items[currentItemIndex].checked = !items[currentItemIndex].checked;
    this.setState((state) => ({ ...state, items}));
  }

  render() {
    const { error, isLoaded, items, newItemInProgress } = this.state;

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
                  <input
                    name="selectAll"
                    type="checkbox"
                    checked={!!this.state.allSelected}
                    onChange={this.handleSelectAll}
                  />
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
                  <td><input
                  name={item.id}
                  type="checkbox"
                  checked={!!item.checked}
                  onChange={() => this.handleSelectOne(item.id)}
                /></td>
                  <td>{item.creditorName}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{parseFloat(item.minPaymentPercentage).toFixed(2)}%</td>
                  <td>{parseFloat(item.balance).toFixed(2)}</td>
                </tr>
              ))}
              {newItemInProgress && 
                <tr key={this.state.idInProgress}>
                <td></td>
                <td>
                  <form>
                    <input
                    type="text"
                    name="creditorInProgress"
                    onChange={this.handleChange}
                    value={this.state.creditorInProgress}
                    />
                  </form>
                </td>
                <td>
                  <form>
                      <input
                      type="text"
                      name="firstNameInProgress"
                      onChange={this.handleChange}
                      value={this.state.firstNameInProgress}
                      />
                    </form>
                </td>
                <td>
                  <form>
                      <input
                      type="text"
                      name="lastNameInProgress"
                      onChange={this.handleChange}
                      value={this.state.lastNameInProgress}
                      />
                    </form>
                </td>
                <td>
                  <form>
                  <input
                  type="number"
                  name="minPayInProgress"
                  onChange={this.handleChange}
                  value={this.state.minPayInProgress}
                  />
                  </form>
                </td>
                <td>
                  <form>
                      <input
                      type="number"
                      name="balanceInProgress"
                      onChange={this.handleChange}
                      value={this.state.balanceInProgress}
                      />
                  </form>
                </td>
              </tr> }
            </tbody>
          </Table>
        </div>
        <div className="tableButtons">
          {newItemInProgress && <div className="saveDebt"><button onClick={this.saveDebt}>Save New Debt</button></div>}
          <div className="addRemoveDebt"><button onClick={this.addDebt}>Add Debt</button> <button onClick={this.removeDebt}>Remove Debt(s)</button></div>
        </div>
        <div className="balanceTotal">
          <Table hover>
            <td>Balance:</td>
            <td>${items.filter(item => item.checked === true).reduce((sum, cur) => sum + parseFloat(cur.balance), 0).toFixed(2)}</td>
          </Table>
        </div>
        <div className="rowCounts">
        Total Row Count: {items.length} | Check Row Count: {items.filter(item => item.checked === true).length}
        </div>
      </div>
    );
  }
  }
}

export default App;