import Sequilize from 'sequelize';
import _ from 'lodash';
//const conn = new Sequilize({})

const Conn = new Sequilize('WLST', 'root', '',{
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Person = Conn.define('person',{
    firstName: {
        type: Sequilize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequilize.STRING,
        allowNull: false
    },
    email: {
        type: Sequilize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});

const Wishlist = Conn.define('wishlist',{
    idItem: {
        type: Sequilize.INTEGER,
        allowNull: false
    },
    nuItem: {
        type: Sequilize.INTEGER,
        allowNull: false
    },
    idRecever: {
        type: Sequilize.INTEGER,
        allowNull: false
    }
});

// Relationships
Person.hasMany(Wishlist);
Wishlist.belongsTo(Person);

Conn.sync().then(()=>{

});

export default Conn;
