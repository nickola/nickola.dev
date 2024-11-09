// React
import React from 'react';
import { createRoot } from 'react-dom/client';

/* @jsx jsx */ // Emotion ("css" property support)
import { jsx } from '@emotion/react';

// CIDR
import cidr from 'ip-cidr';

// crypto-js
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import md5 from 'crypto-js/md5';
import sha1 from 'crypto-js/sha1';
import sha224 from 'crypto-js/sha224';
import sha256 from 'crypto-js/sha256';
import sha384 from 'crypto-js/sha384';
import sha512 from 'crypto-js/sha512';

// htpasswd
import bcrypt from 'bcryptjs';

// Render
window.render = function (id, component) {
  const container = document.getElementById(id);
  const Component = components[component];

  if (container && Component) createRoot(container).render(React.createElement(Component));
};

// Converter
class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {input: '', output: ''};
    this.randomID = String(Math.floor(Math.random() * 9999999));

    // References
    this.inputRef = React.createRef(null);
    this.outputRef = React.createRef(null);
  }

  componentDidMount() {
    // Resize
    if (this.multiline && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        if (entries && entries.length === 1) {
          const current = entries[0].target;

          if (current?.style?.height) {
            const input = this.inputRef.current;
            const output = this.outputRef.current;

            if (input && output) {
              const height = current.style.height;

              if (height) {
                const target = current === input ? output : input;
                if (target.style.height !== height) target.style.height = height;
              }
            }
          }
        }
      });

      this.resizeObserver.observe(this.inputRef.current);
      this.resizeObserver.observe(this.outputRef.current);
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  formSubmit = event => {
    event.preventDefault();
  }

  clearOnEscape = event => {
    // ESC
    if (event?.keyCode === 27) {
      const { input, output } = this.state || {};
      event.preventDefault();

      if (input || output) {
        const value = '';
        this.setState({input: value, output: value, inputError: null, outputError: null});
      }
    }
  };

  changeHandler = (source, value, method) => {
    let result = (value && method) ? method(value) : '';
    let error = null;

    if (result.constructor === Object) {
      error = result.error || "Error";
      result = '';
    }

    if (source === 'output') this.setState({input: result, output: value, inputError: error});
    else this.setState({input: value, output: result, outputError: error});
  };

  changeInput = event => this.changeHandler('input', event?.target?.value, this.convert);
  changeOutput = event => this.changeHandler('output', event?.target?.value, this.backward);

  getCallableValue = value => typeof value === 'function' ? value() : value;

  render() {
    const { input, output, inputError, outputError } = this.state || {};
    const hasBackward = this.backward ? true : false;
    const multiline = this.multiline, inputMultiline = this.inputMultiline, outputMultiline = this.outputMultiline;
    let inputPlaceholder = this.inputPlaceholder, outputPlaceholder = this.outputPlaceholder;

    if (inputPlaceholder && !outputPlaceholder) outputPlaceholder = () => this.convert(inputPlaceholder);

    const inputProps = {
      className: "form-control width-full",
      id: `input-${this.randomID}`,
      ref: this.inputRef,
      value: input,
      placeholder: inputError || this.getCallableValue(inputPlaceholder) || this.input || "Input",
      onChange: this.changeInput,
      onKeyDown: this.clearOnEscape
    };

    const outputProps = {
      className: "form-control width-full",
      id: `output-${this.randomID}`,
      ref: this.outputRef,
      value: output,
      placeholder: outputError || this.getCallableValue(outputPlaceholder) || this.output || "Output"
    };

    if (multiline || inputMultiline) inputProps.rows = this.inputRows || 1;
    if (multiline || outputMultiline) outputProps.rows = this.outputRows || 1;

    if (hasBackward) {
      outputProps.onChange = this.changeOutput;
      outputProps.onKeyDown = this.clearOnEscape;
    }
    else outputProps.disabled = true;

    return (
      <form className="d-flex flex-wrap flex-items-stretch overflow-hidden width-full" autoComplete="off"
            onSubmit={this.formSubmit} css={{
        margin: '-16px 0 16px -16px',
        '.form-control': {margin: 0},
        '.converter-item': {
          margin: '16px 0 0 16px',
          'input, textarea': {
            minWidth: '225px'
          },
          textarea: {
            height: 'auto',
            maxHeight: '150px'
          }
        },
        '.converter-arrow': {
          paddingLeft: '16px'
        }
      }}>
        <div className="form-group flex-1 converter-item">
          <div className="form-group-header width-full">
            <label htmlFor={`input-${this.randomID}`}>{this.input || "Input"}</label>
          </div>
          <div className="form-group-body width-full">
            <div className="d-flex flex-items-stretch">
              <div className="flex-1">
                {(multiline || inputMultiline) ? <textarea {...inputProps} /> : <input {...inputProps} />}
              </div>
              <div className="d-flex flex-items-center converter-arrow">
                {!hasBackward ?
                <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"></path>
                </svg> :
                <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.78 5.97a.75.75 0 0 0-1.06 0l-5.25 5.25a.75.75 0 0 0 0 1.06l5.25 5.25a.75.75 0 0 0 1.06-1.06L3.81 12.5h16.38l-3.97 3.97a.75.75 0 1 0 1.06 1.06l5.25-5.25a.75.75 0 0 0 0-1.06l-5.25-5.25a.75.75 0 1 0-1.06 1.06L20.19 11H3.81l3.97-3.97a.75.75 0 0 0 0-1.06Z"></path>
                </svg>}
              </div>
            </div>
          </div>
        </div>
        <div className="form-group flex-1 converter-item">
          <div className="form-group-header width-full">
            <label htmlFor={`output-${this.randomID}`}>{this.output || "Output"}</label>
          </div>
          <div className="form-group-body width-full">
            {(multiline || outputMultiline) ? <textarea {...outputProps} /> : <input {...outputProps} />}
          </div>
        </div>
      </form>
    );
  }
}

class SimpleConverter extends Converter {
  multiplier = 1
  inputPlaceholder = 1;

  calculate(value, formula) {
    value = parseFloat(value);
    return !isNaN(value) ? parseFloat(formula(value).toFixed(2)) : {error: "Incorrect value"};
  }

  convert = value => this.calculate(value, value => value * this.multiplier);
  backward = value => this.calculate(value, value => value / this.multiplier);
}

// Components
const components = {};

// Measurement
components.inch = class extends SimpleConverter {
  input = "Inches";
  output = "Centimeters";
  multiplier = 2.54;
}

components.foot = class extends SimpleConverter {
  input = "Feet";
  output = "Centimeters";
  multiplier = 30.48;
}

components.mile = class extends SimpleConverter {
  input = "Miles";
  output = "Kilometers";
  multiplier = 1.609344;
}

components.pound = class extends SimpleConverter {
  input = "Pounds";
  output = "Kilograms";
  multiplier = 0.45359237;
}

components.ounce = class extends SimpleConverter {
  input = "Ounces";
  output = "Grams";
  multiplier = 28.349523125;
}

components.gallon_us = class extends SimpleConverter {
  input = "US Gallons";
  output = "Litres";
  multiplier = 3.785411784;
}

components.gallon_us_dry = class extends SimpleConverter {
  input = "US Dry Gallons";
  output = "Litres";
  multiplier = 4.40488377086;
}

components.gallon_imperial = class extends SimpleConverter {
  input = "Imperial Gallons";
  output = "Litres";
  multiplier = 4.54609;
}

// Network
components.cidr = class extends Converter {
  input = "CIDR";
  output = "Range";
  inputPlaceholder = "192.168.1.0/24";

  convert = value => {
    if(!value || !cidr.isValidCIDR(value)) return {error: "Incorrect value"};

    const instance = new cidr(value);
    const range = instance.toRange();
    const total = instance.end({type: 'bigInteger'}) - instance.start({type: 'bigInteger'}) + 1;

    return `${range[0]} - ${range[1]} (${total} IPs)`;
  }
}

// Encoding
components.base64 = class extends Converter {
  input = "Text";
  output = "Base64";
  multiline = true;

  convert = (value) => Base64.stringify(Utf8.parse(value));
  backward = (value) => {
    try {
      return Base64.parse(value).toString(Utf8);
    }
    catch {
      return {error: "Decoded value is not a text"};
    }
  }
};

// Cryptographic
components.md5 = class extends Converter {
  input = "Text";
  output = "MD5";
  multiline = true;

  convert = (value) => md5(value).toString();
};

components.sha1 = class extends Converter {
  input = "Text";
  output = "SHA-1";
  multiline = true;

  convert = (value) => sha1(value).toString();
};

components.sha224 = class extends Converter {
  input = "Text";
  output = "SHA-224";
  multiline = true;
  outputRows = 2;

  convert = (value) => sha224(value).toString();
};

components.sha256 = class extends Converter {
  input = "Text";
  output = "SHA-256";
  multiline = true;
  outputRows = 2;

  convert = (value) => sha256(value).toString();
};

components.sha384 = class extends Converter {
  input = "Text";
  output = "SHA-384";
  multiline = true;
  outputRows = 2;

  convert = (value) => sha384(value).toString();
};

components.sha512 = class extends Converter {
  input = "Text";
  output = "SHA-512";
  multiline = true;
  outputRows = 3;

  convert = (value) => sha512(value).toString();
};

components.htpasswd = class extends Converter {
  input = "Text";
  output = "htpasswd (bcrypt, 8 rounds)";
  outputMultiline = true;
  outputRows = 2;

  convert = value => {
    const cost = 8;
    return bcrypt.hashSync(value, bcrypt.genSaltSync(cost));
  }
};
