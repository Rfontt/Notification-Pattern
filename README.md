# Notification Pattern

Com Domain Driven Design(DDD) temos a prática de que todas as nossas entidades precisam está 100% validadas, ou seja, não podemos deixar algo ser criado de forma invalida. O desenvolvedor pode pensar que isso não será tão difícil de encaixar no seu código, pois existe diferentes formas para tratar esses erros. No entanto, o dev não será o consumidor final do produto e por isso precisamos pensar em quem vai consumí-lo e facilitar o entendimento de erros que esse cliente pode ter cometido ao preencher algum formulário que enviará dados de uma forma que nossas entidades não estão prontas para receber.

Para isso temos o Notification Patter, que irá trocar exceptions(lançamentos de erro) por notificações em um determinado contexto.

### Sem o Notification Pattern

Aqui criamos a nossa entidade que representa um Usuário.Nesse caso, ela possue seus atributos e como queremos evitar que tenhamos futuros problemas com dados indesejados ou que não foram passados, criamos uma função de validação que será executado assim que a class for instânciada. 

```ts
export default class User {
    private id: number;
    private name: string;
    private email: string;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;

        this.validate();
    }

    validate(): void {
        if (this.id === undefined || null) {
            throw new Error('ID is required');
        }

        if (!this.name) {
            throw new Error('Name is required');
        }

        if (!this.email) {
            throw new Error('Email is required');
        }
    }
}
```

Feito isso, Partimos para os testes. Mas note o seguinte:

- O teste um irá passar, pois está apenas validando se o ID é válido ou não;
- O segundo teste também irá passar, pois valida isoladamente o atributo name que será passado(nesse caso está vazio e retornará uma exception);
- Não será diferente para o terceiro teste, pois ele também valida um atributo isoladamente, nesse caso, o email.
- Mas e o quarto teste, será que passa? Bom, aqui encontramos um problema, pois queremos que, se a class for instânciada sem nenhum atributo válido, seja lançado uma exception com a mensagem de erro de cada atributo que está inválido. Mas ele irá retornar apenas uma exception referente ao primeiro atributo, ou seja, o ID. E é por isso que precisamos do Notification Pattern para que possamos evitar essa falta de coerência nas exceptions. 

```ts
test('Should return an exception when id is invalid', () => {
        expect(() => {
            new User(undefined, 'Jhon', 'jhontest15252@gmail.com');
        }).toThrowError('ID is required');
});

test('Should return an exception when name is invalid', () => {
    expect(() => {
        new User(1, '', 'jhontest15252@gmail.com');
    }).toThrowError('Name is required');
});

test('Should return an exception when email is invalid', () => {
    expect(() => {
    new User(1, 'Jhon', '');
    }).toThrowError('Email is required');
});

test('Should return an exception when id, name and email are invalid with all exceptions.', () => {
    expect(() => {
    new User(undefined, '', '');
    }).toThrowError('ID is required, Name is required, Email is required');
});
```

### Com o Notification Pattern

Primeiramente precisamos criar uma interface que contenha tudo sobre as notificações de erros que queremos lançar.

```ts
// Aqui temos um type de notifications, ou seja, ele terá os atributos necessários para um erro.
export type NotificationErrorProps = {
    message: string;
    context: string;
}

// Aqui criamos a interface com os métodos e atributos(nesse caso não tem atributos, apenas métodos) para o tratamento e lançamentos desses erros.
export default interface NotificationInterface {
    addError(error: NotificationErrorProps): void;
    hasErrors(): boolean;
    getErrors(): NotificationInterface[];
    messages(context?:string): string;
}
```