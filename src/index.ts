import server from './server'
import colors from 'colors'

const puerto = process.env.PORT || 4000
server.listen(puerto, () => {
    console.log(colors.cyan(`Rest API en el puerto ${puerto}`))
})