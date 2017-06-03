/**
 * Observer / Listener
 * The observer pattern is used to allow an object to publish changes to its state. Other objects subscribe to be immediately notified of any changes.
 */
console.log('### Observer / Listener ###');

// implement
interface TextChangedListener {
    onTextChanged(newText: string): void
}

class PrintingTextChangedListener implements TextChangedListener {
    onTextChanged(newText: string) {
        console.log(`Text is changed to: ${newText}`);
    }
}

class TextView {
    listener?: TextChangedListener = null
    set text(newText: string) {
        this.listener.onTextChanged(newText);
    }
}

// usage
const textView = new TextView();
textView.listener = new PrintingTextChangedListener();
textView.text = "Lorem ipsum";
textView.text = "dolor sit amet";

/**
 * Strategy
 * The strategy pattern is used to create an interchangeable family of algorithms from which the required process is chosen at run-time.
 */
console.log('### Strategy ###');

// implement
class Printer {
    constructor(public stringFormatterStrategy: Function) { }
    printString(text: string) {
        console.log(this.stringFormatterStrategy(text));
    }
}

const lowerCaseFormatter = (text: string) => text.toLowerCase()
const upperCaseFormatter = (text: string) => text.toUpperCase()

// usage
const lowerCasePrinter = new Printer(lowerCaseFormatter);
lowerCasePrinter.printString("LOREM ipsum DOLOR sit amet");

const upperCasePrinter = new Printer(upperCaseFormatter);
upperCasePrinter.printString("LOREM ipsum DOLOR sit amet");

const prefixPrinter = new Printer((text: string) => `Prefix: ${text}`);
prefixPrinter.printString("LOREM ipsum DOLOR sit amet");

/**
 * Command
 * The command pattern is used to express a request, including the call to be made and all of its required parameters, in a command object. The command may then be executed immediately or held for later use.
 */
console.log('### Command ###');

// implement
interface OrderCommand {
    execute(): void
}

class OrderAddCommand implements OrderCommand {
    constructor(public id: number) { }
    execute() {
        console.log(`adding order with id: ${this.id}`);
    }
}

class OrderPayCommand implements OrderCommand {
    constructor(public id: number) { }
    execute() {
        console.log(`paying for order with id: ${this.id}`);
    }
}

class CommandProcessor {

    private queue = Array<OrderCommand>();

    addToQueue(orderCommand: OrderCommand): CommandProcessor {
        this.queue.push(orderCommand);
        return this;
    }

    processCommands(): CommandProcessor {
        this.queue.forEach((commad: OrderCommand) => {
            commad.execute();
        });
        this.queue = Array<OrderCommand>();
        return this;
    }
}

// usage
new CommandProcessor()
    .addToQueue(new OrderAddCommand(1))
    .addToQueue(new OrderAddCommand(2))
    .addToQueue(new OrderPayCommand(2))
    .addToQueue(new OrderPayCommand(1))
    .processCommands();

/**
 * State
 * The state pattern is used to alter the behaviour of an object as its internal state changes. The pattern allows the class for an object to apparently change at run-time.
 */
console.log('### State ###');

// implement
module State {
    export class Authorization {

    }
    export class Unauthorized extends Authorization {

    }
    export class Authorized extends Authorization {
        constructor(public username: string) {
            super();
        }
    }
}

class AuthorizationPresenter {

    private state: State.Authorization = new State.Unauthorized()

    loginUser(userLogin: string) {
        this.state = new State.Authorized(userLogin);
    }

    logoutUser() {
        this.state = new State.Unauthorized();
    }

    get isAuthorized() {
        switch (this.state.constructor.name) {
            case 'Authorized':
                return true
            default:
                return false
        }
    }

    get userLogin() {
        switch (this.state.constructor.name) {
            case 'Authorized':
                return (this.state as State.Authorized).username;
            default:
                return 'Unknown'
        }
    }

    toString(): string {
        return `User '${this.userLogin}' is logged in: ${this.isAuthorized}`;
    }
}

// usage
const authorization = new AuthorizationPresenter();
authorization.loginUser("admin");
console.log(authorization.toString());
authorization.logoutUser();
console.log(authorization.toString());

/**
 * Adapter
 * The adapter pattern is used to provide a link between two otherwise incompatible types by wrapping the "adaptee" with a class that supports the interface required by the client.
 */
console.log('### Adapter ###');

// implement
interface Temperature {
    temperature: number
}

class CelsiusTemperature implements Temperature {
    constructor(public temperature: number) {}
}

class FahrenheitTemperature implements Temperature {

    constructor(public celsiusTemperature: CelsiusTemperature) {}

    get temperature(): number {
        return this.convertCelsiusToFahrenheit(this.celsiusTemperature.temperature);
    }
    set temperature(temperatureInF) {
        this.celsiusTemperature.temperature = this.convertFahrenheitToCelsius(temperatureInF);
    }

    private convertFahrenheitToCelsius(f: number): number {
        return (f - 32) * 5 / 9;
    }

    private convertCelsiusToFahrenheit(c: number): number {
        return (c * 9 / 5) + 32;
    }
}

// usage
const celsiusTemperature = new CelsiusTemperature(0.0);
const fahrenheitTemperature = new FahrenheitTemperature(celsiusTemperature);

celsiusTemperature.temperature = 36.6;
console.log(`${celsiusTemperature.temperature} C -> ${fahrenheitTemperature.temperature} F`);

fahrenheitTemperature.temperature = 100.0;
console.log(`${fahrenheitTemperature.temperature} F -> ${celsiusTemperature.temperature} C`);

/**
 * Decorator
 * The decorator pattern is used to extend or alter the functionality of objects at run-time by wrapping them in an object of a decorator class. This provides a flexible alternative to using inheritance to modify behaviour.
 */
console.log('### Decorator ###');

// implement
interface CoffeeMachine {
    makeSmallCoffee(): void
    makeLargeCoffee(): void
}

class NormalCoffeeMachine implements CoffeeMachine {
    makeSmallCoffee() {
        console.log("Normal: Making small coffee");
    }
    makeLargeCoffee() {
        console.log("Normal: Making large coffee");
    }
}

// or @Decorator(...) ?
class EnhancedCoffeeMachine {

    constructor(public coffeeMachine: CoffeeMachine) {}

    makeCoffeeWithMilk() {
        console.log("Enhanced: Making coffee with milk");
        this.coffeeMachine.makeSmallCoffee();
        console.log("Enhanced: Adding milk");
    }

    makeDoubleLargeCoffee() {
        console.log("Enhanced: Making double large coffee");
        this.coffeeMachine.makeLargeCoffee();
        this.coffeeMachine.makeLargeCoffee();
    }
}

// usage
const normalMachine = new NormalCoffeeMachine();
const enhancedMachine = new EnhancedCoffeeMachine(normalMachine);

enhancedMachine.makeCoffeeWithMilk();
enhancedMachine.makeDoubleLargeCoffee();

/**
 * Facade
 * The facade pattern is used to define a simplified interface to a more complex subsystem.
 */
console.log('### Facade ###');

// implement
class ComplexSystemStore {

    private _store = new Map<string, string>()

    constructor(public filePath: string) {
        console.log(`Reading data from file: ${this.filePath}`);
    }

    store(key: string, payload: string) {
        this._store.set(key, payload);
    }

    read(key: string): string {
        return this._store.has(key) ? this._store.get(key) : '';
    }

    commit() {
        const keys = Array.from(this._store.keys());
        console.log(`Storing cached data: ${keys} to file: ${this.filePath}`);
    }
}

class User {
    constructor(public login: string) {}
}

//Facade:
class UserRepository {
    systemPreferences = new ComplexSystemStore("/data/default.prefs");

    save(user: User) {
        this.systemPreferences.store("USER_KEY", user.login);
        this.systemPreferences.commit();
    }

    findFirst(): User {
        return new User(this.systemPreferences.read("USER_KEY"));
    }
}

// usage
const userRepository = new UserRepository();
const user = new User("dbacinski");
userRepository.save(user);
const resultUser = userRepository.findFirst();
console.log(`Found stored user: ${resultUser.login}`);

