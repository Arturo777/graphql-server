import { ApolloServer, gql, UserInputError } from 'apollo-server'

const contacts = [
  {
    name: 'Jimmy',
    email: 'Jimmy@gmail.com',
    phone: '123-234-345',
    street: 'Lopez Mateos',
    city: 'CDMX',
    id: '1',
  },
  {
    name: 'James',
    email: 'James@gmail.com',
    phone: '123-234-345',
    street: 'JOSEFINA ENRIQUEZ PEÑA',
    city: 'Guadalajara',
    id: '2',
  },
  {
    name: 'Josh',
    email: 'Josh@gmail.com',
    phone: '123-234-345',
    street: 'MATEO BENITEZ JUAN',
    city: 'Tijuana',
    id: '3',
  },
  {
    name: 'Jou',
    email: 'Jou@gmail.com',
    phone: '123-234-345',
    street: 'Plutarco Elías Calles',
    city: 'Juarez',
    id: '4',
  },
]

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }

  type Contact {
    name: String!
    email: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    contactsCount: Int!
    allContacts: [Contact]!
    findContact(name: String!): Contact
  }

  type Mutation {
    addContact(
      name: String!
      phone: String
      street: String!
      city: String! 
    ): Contact 
  }
`

const resolvers = {
  Query: {
    contactsCount: () => contacts.length,
    allContacts: () => contacts,
    findContact: (root, args) => {
      const { name } = args
      return contacts.find((contact) => contact.name === name)
    },
  },
  Contact: {
    address: (root) => ({ street: root.street, city: root.city }),
  },
  Mutation: {
    addContact: (root, args) => {
      if (contacts.find(contact => contact.name === args.name)) {
         throw new UserInputError('Ese nombre ya existe', {
           campoInvalido: args.name
          }) 
      }
      const contact = { ...args, id: new Date().getTime().toString() }
      contacts.push(contact) 
      return contact 
    }
  }
   
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})