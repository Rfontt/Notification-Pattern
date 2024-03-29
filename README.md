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
describe('Unit tests for user', () => {
    test('Should return an exception when id is invalid', () => {
        expect(() => {
            new User(undefined, 'Jhon', 'jhontest15252@gmail.com')
        }).toThrowError('User: ID is required');
    });

    test('Should return an exception when name is invalid', () => {
        expect(() => {
            new User(1, '', 'jhontest15252@gmail.com');
        }).toThrowError('User: Name is required');
    });

    test('Should return an exception when email is invalid', () => {
        expect(() => {
            new User(1, 'Jhon', '');
        }).toThrowError('User: Email is required');
    });

    test('Should return an exception when id, name and email are invalid with all exceptions.', () => {
        expect(() => {
            new User(undefined, '', '');
        }).toThrowError('User: ID is required,User: Name is required,User: Email is required');
    });
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

Feito isso, precisamos de uma class de notificação para tratar esses métodos de criação, verificação, seleção e messagens de erros.

```ts
import NotificationInterface, { NotificationErrorProps } from "../interfaces/notification.interface";

export default class Notification implements NotificationInterface {
    // Atributo que guardará os errors e possuirá o  tipoNotificationErrorProps 
    private errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps): void {
        // Adiciona um erro ao array(com atributos: context e message)
        this.errors.push(error);
    }
    hasErrors(): boolean {
        // Verifica se o array possui elementos, ou seja, é maior que zero.
        return this.errors.length > 0;
    }
    getErrors(): NotificationErrorProps[] {
        // retorna o array que contêm os erros
        return this.errors;
    }
    messages(context?: string): string {
        // Cria uma variável que irá ser retornada
        let message = '';

        // Faz um map nos erros para pegar todas as suas mensagens. Mas para isso verifica se o context é undefined ou é igual ao contexto passado.
        this.errors.map((error) => {
            if (context === undefined || error.context === context) {
                message += `${error.context}: ${error.message}`;
            }
        });

        return message;
    }    
}
```

Agora, precisamos criar a class de NotificationError que cuidará da mensagem que será repassada para o cliente que consumirá essa entidade, caso ele cometa algum erro.

```ts
import { NotificationErrorProps } from "../interfaces/notification.interface";

export default class NotificationError extends Error {
    constructor(public errors: NotificationErrorProps[]) {
        super(errors.map(error => `${error.context}: ${error.message}`).join(","));
    }
}
```

Por fim, modificamos nossa class de User para a melhor forma de evitar erros na instância da mesma.

```ts
export default class User {
    private id: number;
    private name: string;
    private email: string;
    // Cuidará da instância de Notification para que possamos manipular seus métodos
    private notification: NotificationInterface;

    constructor(id: number, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        // Instânciamos a notification
        this.notification = new Notification();
        // Mantemos nossa função
        this.validate();
        
        // Verificamos se tem error e se tiver lançamos a nossa "notification".
        if(this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    // Continuamos com nossa função de validação, porém agora ela irá adicionar os erros no nosso método addError({ context, message });
    validate(): void {
        if (this.id === undefined || null) {
            this.notification.addError({
                context: "User",
                message: "ID is required"
            });
        }

        if (!this.name) {
            this.notification.addError({
                context: "User",
                message: "Name is required"
            });
        }

        if (!this.email) {
            this.notification.addError({
                context: "User",
                message: "Email is required"
            });
        }
    }
}
```

### Final
 
Bom, com isso você aprendeu como organizar e validar seus códigos para evitar possíveis erros. Lembre-se sempre de rodar o arquivo de testes no final.

**COMPILO-TESTO-FAÇO COMMIT**