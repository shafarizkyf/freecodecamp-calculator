import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [shouldNegative, setShouldNegative] = useState(false);

  const onInputNumber = ({ target }) => {
    const lastNumber = data[data.length - 1].toString();
    const isDecimal = target.value === '.';

    if (lastNumber.search(/\./) !== -1 && isDecimal) {
      return;
    }

    if (!data.length) {
      setData([target.value]);
    } else {
      const lastDataIsOperator = isNaN(lastNumber);

      if (shouldNegative) {
        setData((prev) => [
          ...prev.slice(0, data.length - 1),
          data[data.length - 1] + target.value
        ]);

        setShouldNegative(false);
      } else if (lastDataIsOperator) {
        setData((prev) => [...prev, target.value]);
      } else {
        let number = lastNumber + target.value;
        const hasLeadingZero = number.search('0') === 0;

        if (hasLeadingZero) {
          number = lastNumber + target.value;
          // remove leading zero, i.g 0123 to 123
          number = Number(number).toString();
        }

        setData((prev) => [
          ...prev.slice(0, data.length - 1),
          number
        ]);
      }
    }
  }

  const onInputOperator = ({ target }) => {
    if (data.length) {
      const lastData = data[data.length - 1];
      const lastDataIsOperator = isNaN(lastData) && target.value !== '-';

      // change last number to negative number instead of substract
      const shouldNegative = isNaN(lastData) && target.value === '-';
      setShouldNegative(shouldNegative);

      if (lastDataIsOperator) {
        // if user change from negative number to other operator
        let endSlice = data.length - 1;
        if (data.length >= 3 && isNaN(data[data.length - 1]) && isNaN(data[data.length - 2])) {
          endSlice = data.length - 2;
        }

        setData((prev) => [
          ...prev.slice(0, endSlice),
          target.value
        ]);
      } else {
        setData((prev) => [
          ...prev,
          target.value
        ]);
      }
    } else {
      setData(['0', target.value]);
    }
  }

  const onReset = () => {
    setData(['0']);
  }

  // im using Immediate Execution Logic
  const getResult = () => {
    let currentResult = 0;
    let queue = [...data];

    while(queue.length > 1) {
      currentResult = calculate(queue[0], queue[2], queue[1]);
      queue = [
        currentResult,
        ...queue.slice(3),
      ];
    }

    setData(queue);
  }

  const calculate = (a, b, operator) => {
    switch(operator) {
      case '+':
        return Number(a) + Number(b);
      case '-':
        return Number(a) - Number(b);
      case '*':
        return Number(a) * Number(b);
      case '/':
        return Number(a) / Number(b);
    }
  }

  return (
    <div className="app">
      <input type="text" id="display" value={data.join('')} disabled />
      <div className="keys">
        <button id="add" onClick={onInputOperator} className="operator" value="+">+</button>
        <button id="subtract" onClick={onInputOperator} className="operator" value="-">-</button>
        <button id="multiply" onClick={onInputOperator} className="operator" value="*">&times;</button>
        <button id="divide" onClick={onInputOperator} className="operator" value="/">&divide;</button>

        <button id="seven" onClick={onInputNumber} value="7">7</button>
        <button id="eight" onClick={onInputNumber} value="8">8</button>
        <button id="nine" onClick={onInputNumber} value="9">9</button>

        <button id="four" onClick={onInputNumber} value="4">4</button>
        <button id="five" onClick={onInputNumber} value="5">5</button>
        <button id="six" onClick={onInputNumber} value="6">6</button>

        <button id="one" onClick={onInputNumber} value="1">1</button>
        <button id="two" onClick={onInputNumber} value="2">2</button>
        <button id="three" onClick={onInputNumber} value="3">3</button>

        <button id="zero" onClick={onInputNumber} value="0">0</button>
        <button id="decimal" onClick={onInputNumber} value=".">.</button>
        <button id="clear" onClick={onReset} value="all-clear">AC</button>
        <button id="equals" onClick={getResult} className="operator" value="=">=</button>
      </div>
    </div>
  );
}

export default App;
