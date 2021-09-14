import Sequelize, { Model } from "sequelize";

class Task extends Model {
    static init(sequelize){
        super.init({
            description = Sequelize.STRING,
            status: Sequelize.ENUM("open", "doing", "finished"),
            date_begin: Sequelize.DATE,
            date_finish: Sequelize.DATE,
        },{
            sequelize,
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'responsible_id', as: 'responsible',});
    }
}

module.exports = Task;
