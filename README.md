# Notification Pattern

Com Domain Driven Design(DDD) temos a prática de que todas as nossas entidades precisam está 100% validadas, ou seja, não podemos deixar algo ser criado de forma invalida. O desenvolvedor pode pensar que isso não será tão difícil de encaixar no seu código, pois existe diferentes formas para tratar esses erros. No entanto, o dev não será o consumidor final do produto e por isso precisamos pensar em quem vai consumí-lo e facilitar o entendimento de erros que esse cliente pode ter cometido ao preencher algum formulário que enviará dados de uma forma que nossas entidades não estão prontas para receber.

Para isso temos o Notification Patter, que irá trocar exceptions(lançamentos de erro) por notificações em um determinado contexto.

### Sem o Notification Pattern

```ts
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
```