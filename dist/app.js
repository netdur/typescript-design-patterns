var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
console.log('### Observer / Listener ###');
var PrintingTextChangedListener = (function () {
    function PrintingTextChangedListener() {
    }
    PrintingTextChangedListener.prototype.onTextChanged = function (newText) {
        console.log("Text is changed to: " + newText);
    };
    return PrintingTextChangedListener;
}());
var TextView = (function () {
    function TextView() {
        this.listener = null;
    }
    Object.defineProperty(TextView.prototype, "text", {
        set: function (newText) {
            this.listener.onTextChanged(newText);
        },
        enumerable: true,
        configurable: true
    });
    return TextView;
}());
var textView = new TextView();
textView.listener = new PrintingTextChangedListener();
textView.text = "Lorem ipsum";
textView.text = "dolor sit amet";
console.log('### Strategy ###');
var Printer = (function () {
    function Printer(stringFormatterStrategy) {
        this.stringFormatterStrategy = stringFormatterStrategy;
    }
    Printer.prototype.printString = function (text) {
        console.log(this.stringFormatterStrategy(text));
    };
    return Printer;
}());
var lowerCaseFormatter = function (text) { return text.toLowerCase(); };
var upperCaseFormatter = function (text) { return text.toUpperCase(); };
var lowerCasePrinter = new Printer(lowerCaseFormatter);
lowerCasePrinter.printString("LOREM ipsum DOLOR sit amet");
var upperCasePrinter = new Printer(upperCaseFormatter);
upperCasePrinter.printString("LOREM ipsum DOLOR sit amet");
var prefixPrinter = new Printer(function (text) { return "Prefix: " + text; });
prefixPrinter.printString("LOREM ipsum DOLOR sit amet");
console.log('### Command ###');
var OrderAddCommand = (function () {
    function OrderAddCommand(id) {
        this.id = id;
    }
    OrderAddCommand.prototype.execute = function () {
        console.log("adding order with id: " + this.id);
    };
    return OrderAddCommand;
}());
var OrderPayCommand = (function () {
    function OrderPayCommand(id) {
        this.id = id;
    }
    OrderPayCommand.prototype.execute = function () {
        console.log("paying for order with id: " + this.id);
    };
    return OrderPayCommand;
}());
var CommandProcessor = (function () {
    function CommandProcessor() {
        this.queue = Array();
    }
    CommandProcessor.prototype.addToQueue = function (orderCommand) {
        this.queue.push(orderCommand);
        return this;
    };
    CommandProcessor.prototype.processCommands = function () {
        this.queue.forEach(function (commad) {
            commad.execute();
        });
        this.queue = Array();
        return this;
    };
    return CommandProcessor;
}());
new CommandProcessor()
    .addToQueue(new OrderAddCommand(1))
    .addToQueue(new OrderAddCommand(2))
    .addToQueue(new OrderPayCommand(2))
    .addToQueue(new OrderPayCommand(1))
    .processCommands();
console.log('### State ###');
var State;
(function (State) {
    var Authorization = (function () {
        function Authorization() {
        }
        return Authorization;
    }());
    State.Authorization = Authorization;
    var Unauthorized = (function (_super) {
        __extends(Unauthorized, _super);
        function Unauthorized() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Unauthorized;
    }(Authorization));
    State.Unauthorized = Unauthorized;
    var Authorized = (function (_super) {
        __extends(Authorized, _super);
        function Authorized(username) {
            var _this = _super.call(this) || this;
            _this.username = username;
            return _this;
        }
        return Authorized;
    }(Authorization));
    State.Authorized = Authorized;
})(State || (State = {}));
var AuthorizationPresenter = (function () {
    function AuthorizationPresenter() {
        this.state = new State.Unauthorized();
    }
    AuthorizationPresenter.prototype.loginUser = function (userLogin) {
        this.state = new State.Authorized(userLogin);
    };
    AuthorizationPresenter.prototype.logoutUser = function () {
        this.state = new State.Unauthorized();
    };
    Object.defineProperty(AuthorizationPresenter.prototype, "isAuthorized", {
        get: function () {
            switch (this.state.constructor.name) {
                case 'Authorized':
                    return true;
                default:
                    return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthorizationPresenter.prototype, "userLogin", {
        get: function () {
            switch (this.state.constructor.name) {
                case 'Authorized':
                    return this.state.username;
                default:
                    return 'Unknown';
            }
        },
        enumerable: true,
        configurable: true
    });
    AuthorizationPresenter.prototype.toString = function () {
        return "User '" + this.userLogin + "' is logged in: " + this.isAuthorized;
    };
    return AuthorizationPresenter;
}());
var authorization = new AuthorizationPresenter();
authorization.loginUser("admin");
console.log(authorization.toString());
authorization.logoutUser();
console.log(authorization.toString());
console.log('### Adapter ###');
var CelsiusTemperature = (function () {
    function CelsiusTemperature(temperature) {
        this.temperature = temperature;
    }
    return CelsiusTemperature;
}());
var FahrenheitTemperature = (function () {
    function FahrenheitTemperature(celsiusTemperature) {
        this.celsiusTemperature = celsiusTemperature;
    }
    Object.defineProperty(FahrenheitTemperature.prototype, "temperature", {
        get: function () {
            return this.convertCelsiusToFahrenheit(this.celsiusTemperature.temperature);
        },
        set: function (temperatureInF) {
            this.celsiusTemperature.temperature = this.convertFahrenheitToCelsius(temperatureInF);
        },
        enumerable: true,
        configurable: true
    });
    FahrenheitTemperature.prototype.convertFahrenheitToCelsius = function (f) {
        return (f - 32) * 5 / 9;
    };
    FahrenheitTemperature.prototype.convertCelsiusToFahrenheit = function (c) {
        return (c * 9 / 5) + 32;
    };
    return FahrenheitTemperature;
}());
var celsiusTemperature = new CelsiusTemperature(0.0);
var fahrenheitTemperature = new FahrenheitTemperature(celsiusTemperature);
celsiusTemperature.temperature = 36.6;
console.log(celsiusTemperature.temperature + " C -> " + fahrenheitTemperature.temperature + " F");
fahrenheitTemperature.temperature = 100.0;
console.log(fahrenheitTemperature.temperature + " F -> " + celsiusTemperature.temperature + " C");
console.log('### Decorator ###');
var NormalCoffeeMachine = (function () {
    function NormalCoffeeMachine() {
    }
    NormalCoffeeMachine.prototype.makeSmallCoffee = function () {
        console.log("Normal: Making small coffee");
    };
    NormalCoffeeMachine.prototype.makeLargeCoffee = function () {
        console.log("Normal: Making large coffee");
    };
    return NormalCoffeeMachine;
}());
var EnhancedCoffeeMachine = (function () {
    function EnhancedCoffeeMachine(coffeeMachine) {
        this.coffeeMachine = coffeeMachine;
    }
    EnhancedCoffeeMachine.prototype.makeCoffeeWithMilk = function () {
        console.log("Enhanced: Making coffee with milk");
        this.coffeeMachine.makeSmallCoffee();
        console.log("Enhanced: Adding milk");
    };
    EnhancedCoffeeMachine.prototype.makeDoubleLargeCoffee = function () {
        console.log("Enhanced: Making double large coffee");
        this.coffeeMachine.makeLargeCoffee();
        this.coffeeMachine.makeLargeCoffee();
    };
    return EnhancedCoffeeMachine;
}());
var normalMachine = new NormalCoffeeMachine();
var enhancedMachine = new EnhancedCoffeeMachine(normalMachine);
enhancedMachine.makeCoffeeWithMilk();
enhancedMachine.makeDoubleLargeCoffee();
console.log('### Facade ###');
var ComplexSystemStore = (function () {
    function ComplexSystemStore(filePath) {
        this.filePath = filePath;
        this._store = new Map();
        console.log("Reading data from file: " + this.filePath);
    }
    ComplexSystemStore.prototype.store = function (key, payload) {
        this._store.set(key, payload);
    };
    ComplexSystemStore.prototype.read = function (key) {
        return this._store.has(key) ? this._store.get(key) : '';
    };
    ComplexSystemStore.prototype.commit = function () {
        var keys = Array.from(this._store.keys());
        console.log("Storing cached data: " + keys + " to file: " + this.filePath);
    };
    return ComplexSystemStore;
}());
var User = (function () {
    function User(login) {
        this.login = login;
    }
    return User;
}());
var UserRepository = (function () {
    function UserRepository() {
        this.systemPreferences = new ComplexSystemStore("/data/default.prefs");
    }
    UserRepository.prototype.save = function (user) {
        this.systemPreferences.store("USER_KEY", user.login);
        this.systemPreferences.commit();
    };
    UserRepository.prototype.findFirst = function () {
        return new User(this.systemPreferences.read("USER_KEY"));
    };
    return UserRepository;
}());
var userRepository = new UserRepository();
var user = new User("dbacinski");
userRepository.save(user);
var resultUser = userRepository.findFirst();
console.log("Found stored user: " + resultUser.login);
