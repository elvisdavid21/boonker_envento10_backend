import {Table, Column, Model, DataType, Default} from 'sequelize-typescript'

@Table({
    tableName: 'invitados'
})

class Invitados extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    nombre: string

    @Default('Constructora')
    @Column({
        type: DataType.STRING(100)
    })
    apellido: string

    @Column({
        type: DataType.STRING(10)
    })
    telefono: string

    @Column({
        type: DataType.STRING(80)
    })
    email: string

    @Column({
        type: DataType.STRING(20)
    })
    fecha: string
}

export default Invitados