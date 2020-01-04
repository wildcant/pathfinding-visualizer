import React from 'react';
import './test.css';

export default class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Hace enfoque del campo de texto usando un método propio del DOM
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    console.log(this.textInput);
    // Auto enfoca el campo después de que el componente se monta
    this.focusTextInput();
  }

  render() {
    
    // Usa el `ref` mediante callback para guardar una referencia al campo de texto del DOM
    // en una propiedad de la instancia (por ejemplo, this.textInput)
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}