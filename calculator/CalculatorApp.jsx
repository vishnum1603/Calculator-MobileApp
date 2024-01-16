import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CalculatorApp = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [openParentheses, setOpenParentheses] = useState(0);
  const [closeParentheses, setCloseParentheses] = useState(0);

  const handleButtonPress = (value) => {
    if (value === '=') {
      try {
        const evaluatedResult = evaluateExpression(input);
        setResult(evaluatedResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
      setOpenParentheses(0);
      setCloseParentheses(0);
    } else if (value === '+/-') {
      setInput((prevInput) => (prevInput.startsWith('-') ? prevInput.slice(1) : '-' + prevInput));
    } else if (value === '()') {
      const lastChar = input.slice(-1);
      if (openParentheses <= closeParentheses) {
        setInput((prevInput) => (/[+\-*/(]/.test(lastChar) ? prevInput + '(' : prevInput + '*('));
        setOpenParentheses(openParentheses + 1);
      } else {
        setInput((prevInput) => prevInput + ')');
        setCloseParentheses(closeParentheses + 1);
      }
    } else {
      const lastChar = input.slice(-1);
      if (/[+\-*/(]/.test(lastChar) && value === '(') {
        setInput((prevInput) => prevInput + value);
        setOpenParentheses(openParentheses + 1);
      } else {
        setInput((prevInput) => prevInput + value);
      }
    }
  };

  const evaluateExpression = (expression) => {
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
    return evaluateWithParentheses(sanitizedExpression);
  };

  const evaluateWithParentheses = (expression) => {
    let result = 0;
    let currentExpression = expression;

    while (currentExpression.includes('(')) {
      const openIndex = currentExpression.lastIndexOf('(');
      const closeIndex = currentExpression.indexOf(')', openIndex);

      if (closeIndex === -1) {
        throw new Error('Unbalanced parentheses');
      }

      const innerExpression = currentExpression.slice(openIndex + 1, closeIndex);
      const innerResult = evaluateWithoutParentheses(innerExpression);
      currentExpression =
        currentExpression.slice(0, openIndex) + innerResult + currentExpression.slice(closeIndex + 1);
    }

    result = evaluateWithoutParentheses(currentExpression);
    return result;
  };

  const evaluateWithoutParentheses = (expression) => {
    const sanitizedWithMultiplication = expression.replace(/([)\d])\(/g, '$1*(');
    return Function(`'use strict'; return (${sanitizedWithMultiplication})`)();
  };

  const buttons = [
    ['C', '()', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['+/-', '0', '.', '='],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.input}>{input.replace(/\*\(+/g, '(')}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={styles.button}
                onPress={() => handleButtonPress(button)}>
                <Text style={styles.buttonText}>{button}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  displayContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  input: {
    fontSize: 24,
  },
  result: {
    fontSize: 18,
    color: 'gray',
  },
  buttonsContainer: {
    backgroundColor: '#d4d4d4',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default CalculatorApp;
