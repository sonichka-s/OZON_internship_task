import "./styles/styles.less";
import { v4 as uuidv4 } from "uuid";

export default class ProgressBar {
  constructor(
    container,
    options = { value: 65, animated: false, hided: false }
  ) {
    this._container = container;
    this.value = options.value;
    this.animated = options.animated;
    this.hided = options.hided;

    this.init();

    this._inputElement.addEventListener("input", (e) =>
      this._setValue(e.target.value)
    );

    this._animateElement.addEventListener("change", (e) =>
      this._onAnimate(e.target.checked)
    );

    this._hideElement.addEventListener("change", (e) =>
      this._onHide(e.target.checked)
    );
  }

  _circleOptions = {
    r: 70,
    cx: 80,
    cy: 80,
    "stroke-width": "12px",
  };
  _progressLineId = uuidv4();
  _barId = uuidv4();

  _animationSpeed = 7;
  _isValidValue = true;

  _inputElement = null;
  _animateElement = null;
  _hideElement = null;

  init() {
    const containerElement = document.getElementById(this._container);
    const parentElement = document.createElement("div");
    parentElement.className = "progress__body";

    const barElement = this._createBar();
    parentElement.appendChild(barElement);

    const controlBlock = this._createControlBlock();
    parentElement.appendChild(controlBlock);

    parentElement.append(barElement, controlBlock);

    containerElement.appendChild(parentElement);

    this._animate();
  }

  _createControlBlock() {
    const parentControlBlock = document.createElement("div");
    parentControlBlock.className = "progress__control";

    this._inputElement = document.createElement("input");
    this._inputElement.setAttribute('type', 'number')

    this._inputElement.className = "progress__control-input";
    const inputLabel = document.createElement("div");
    inputLabel.textContent = "Value";

    this._inputElement.value = this.value;

    this._animateElement = this._createToggle();
    const animationLabel = document.createElement("div");
    animationLabel.textContent = "Animate";

    this._hideElement = this._createToggle();
    const hideLabel = document.createElement("div");
    hideLabel.textContent = "Hide";

    parentControlBlock.append(
      this._inputElement,
      inputLabel,
      this._animateElement,
      animationLabel,
      this._hideElement,
      hideLabel
    );

    return parentControlBlock;
  }

  _createToggle() {
    const toggleElement = document.createElement("label");
    toggleElement.className = "progress__control-switch";

    const switchElement = document.createElement("input");
    switchElement.setAttribute("type", "checkbox");
    switchElement.className = "progress__control-switch-checkbox";

    const roundElement = document.createElement("span");
    roundElement.className = "progress__control-switch-slider";

    toggleElement.append(switchElement, roundElement);

    return toggleElement;
  }

  _createBar() {
    const barOptions = {
      width: "160",
      height: "160",
      viewBox: "0 0 160 160",
      style: "transform: rotate(-90deg)",
      id: this._barId
    };

    const barElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this._setAttributes(barElement, barOptions);

    console.log(barElement);

    const mainCircle = this._createCircle("track");
    const progressCircle = this._createCircle("progress");

    barElement.append(mainCircle, progressCircle);

    return barElement;
  }

  _createCircle(type) {
    const circleOptions = {
      fill: "transparent",
      stroke: type === "track" ? "#eef3f5" : "#015dff",
      ...this._circleOptions,
    };

    const circleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this._setAttributes(circleElement, circleOptions);

    if (type === "progress") {
      const strokeDasharray = 2 * this._circleOptions.r * Math.PI;
      this._setAttributes(circleElement, {
        id: this._progressLineId,
        "stroke-dasharray": strokeDasharray,
      });
      circleElement.setAttribute("id", this._progressLineId);
    }

    return circleElement;
  }

  _setValue(value) {
    this._validateInput(parseInt(value));

    if (!this._isValidValue) return;

    this.value = parseInt(value);
    this._animate();
  }

  _onSetValue(value = this.value) {
    const progressElement = document.getElementById(this._progressLineId);
    const strokeDasharray = progressElement.getAttribute("stroke-dasharray");
    const strokeDashoffset = strokeDasharray * ((100 - value) / 100);

    progressElement.setAttribute("stroke-dashoffset", strokeDashoffset);
  }

  _onAnimate(value) {
    console.log(value);
    if (!value) {
        this.animated = false;
        window.cancelAnimationFrame(this.__currentAnimationId)
    } else {
        this.animated = true;
    }

    this._animate();
  }

  _onHide(value) {
    const barElement = document.getElementById(this._barId)

    value ? barElement.style.visibility = 'hidden' : barElement.style.visibility = null
  }

  _animate() {
    let currentValue = 0;

    const start = () => {
      this.__currentAnimationId = window.requestAnimationFrame(start);

      this._onSetValue(currentValue++);

      if (this.animated) {
        if (currentValue === 200) {
          currentValue = 0;
        }
      }

      if (currentValue === this.value && !this.animated) {
        window.cancelAnimationFrame(this.__currentAnimationId);
      }

      return;
    };

    window.requestAnimationFrame(start);
  }

  _setAttributes(element, options) {
    for (let key in options) {
      element.setAttribute(key, options[key]);
    }
  }

  _validateInput(value) {
    console.log(typeof value)
    if (!value) {
      this._isValidValue = false;
    } else if (value > 100 || value < 0 || typeof value !== 'number') {
      this._isValidValue = false;
      this._inputElement.classList.add("progress__control-input-invalid");
    } else if (!this._isValidValue) {
      this._isValidValue = true;
      this._inputElement.classList.remove("progress__control-input-invalid");
    }
  }
}

const barElement = new ProgressBar("container");
console.log(barElement);
