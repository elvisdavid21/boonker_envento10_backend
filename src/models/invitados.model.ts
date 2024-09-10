import {Table, Column, Model, DataType, Default} from 'sequelize-typescript'

@Table({
    tableName: 'invitados'
})

class Invitados extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    nombre!: string

    @Column({
        type: DataType.STRING(10)
    })
    telefono!: string

    @Column({
        type: DataType.STRING(80)
    })
    email!: string

    @Column({
        type: DataType.STRING(80)
    })
    fecha!: string

    @Column({
        type: DataType.STRING(50)
    })
    constructora!: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    asistencia!: boolean
}

export default Invitados