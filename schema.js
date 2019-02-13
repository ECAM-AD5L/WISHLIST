import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';
import Db from './db';

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'this represents a person',
    fields: () => {
        return {
            id:{
                type: GraphQLInt,
                resolve(person){
                    return person.id;
                }
            },
            firstName:{
                type: GraphQLString,
                resolve(person) {
                    return person.firstName;
                }
            },
            lastName:{
                type: GraphQLString,
                resolve(person) {
                    return person.lastName;
                }
            },
            email:{
                type: GraphQLString,
                resolve(person) {
                    return person.email;
                }
            },
            wishlists:{
                type: new GraphQLList(Wishlist),
                resolve(person) {
                    return person.getWishlists();
                }
            }
        };
    }
});

const Wishlist = new GraphQLObjectType({
    name: 'Wishlist',
    description: 'list of wishlist',
    fields: () => {
        return{
            idItem:{
                type: GraphQLInt,
                resolve(wishlist) {
                    return wishlist.idItem;
                }
            },
            nuItem:{
                type: GraphQLInt,
                resolve(wishlist) {
                    return wishlist.nuItem;
                }
            },
            idRecever:{
                type: GraphQLInt,
                resolve(wishlist) {
                    return wishlist.idRecever;
                }
            },
            person:{
                type:Person,
                resolve(wishlist) {
                    return wishlist.getPerson();
                }
            }
        };
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'this is root Query',
    fields: () => {
        return{
            people:{
                type: GraphQLList(Person),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    firstName: {
                        type: GraphQLString
                    },
                    lastName: {
                        type: GraphQLString
                    },
                    email: {
                        type: GraphQLString
                    }
                },
                resolve(root, args){
                    return Db.models.person.findAll({where: args});
                }
            },
            wishlists: {
                type: GraphQLList(Wishlist),
                args:{
                    personId: {
                        type: GraphQLInt
                    },
                    idItem: {
                        type: GraphQLInt
                    },
                    nuItem: {
                        type: GraphQLInt
                    },
                    idRecever: {
                        type: GraphQLInt
                    }
                },
                resolve(root, args){
                    return Db.models.wishlist.findAll({where: args});
                }
            }
        };
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Function to create wish',
    fields: () => {
        return{
            addPerson:{
                type: Person,
                args: {
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args){
                    return Db.models.person.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase()
                    });
                }
            },
            addWishlist:{
                type: Wishlist,
                args: {
                    userId: {
                        type: GraphQLNonNull(GraphQLInt)
                    },
                    idItem: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    nuItem: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    idRecever: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve (source, args) {
                    return Db.models.person.findById(args.userId).then( user => {
                        return user.createWishlist({
                            idItem: args.idItem,
                            nuItem: args.nuItem,
                            idRecever: args.idRecever
                        });
                    });
                }
            },
            delWishlist: {
                type: GraphQLList(Wishlist),
                description: 'Delete wishlists by args.',
                args: {
                    id: { type: GraphQLInt },
                    personId: { type: GraphQLInt },
                    idItem: { type: GraphQLInt },
                    idRecever: { type: GraphQLInt }
                },
                /*resolve(source, args){
                    return Db.models.wishlist.destroy({where: args});
                }*/
                resolve: (source, args) => {
                    return Db.models.wishlist.destroy({
                        where: args
                    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                        if(rowDeleted === 1){
                            console.log('Deleted successfully');
                        }
                    }, function(err){
                        console.log(err);
                    });
                }
            },
            updateWishlist: {
                type: Wishlist,
                description: 'update wishlists by userid.',
                args: {
                    id: { type: new GraphQLNonNull(GraphQLInt) },
                    idItem: { type: new GraphQLNonNull(GraphQLInt) },
                    nuItem: { type: new GraphQLNonNull(GraphQLInt) },
                    userId: { type: new GraphQLNonNull(GraphQLInt) },
                    idRecever: { type: new GraphQLNonNull(GraphQLInt) }
                },
                resolve: async (source, args) => {
                    const wlst = await Db.models.wishlist.findById(args.id)
                    wlst.set({
                        idItem: args.idItem,
                        nuItem: args.nuItem,
                        userId: args.userId,
                        idRecever: args.idRecever
                    })
                    return wlst.save()
                }
            }
        };
    }
});


const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default schema;
