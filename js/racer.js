

function criarElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function CarroInimigo(largura,x){
    this.elemento = criarElemento('img', 'car-enemy')
    this.elemento.src = `img/pixel-car${Math.floor(Math.random() * (4 - 1)) + 1}.png`
    

    this.sortearPosicao = () =>{
        const posicao = Math.random() * (largura - 0)
        this.elemento.style.left = `${posicao}px`
    }

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])

    this.setY = y => this.elemento.style.bottom = `${y}px`

    this.getAltura = () => this.elemento.clientHeight

    this.sortearPosicao()
    this.setY(x)

}

function Carros(largura, altura, espaco) {
    this.cars = [
        new CarroInimigo(largura, altura),
        new CarroInimigo(largura, altura + espaco),
        new CarroInimigo(largura, altura + espaco * 2),
        new CarroInimigo(largura, altura + espaco * 3),
        new CarroInimigo(largura, altura + espaco * 4)
    ]

    const deslocamento = 4
    this.animar = () => {
        this.cars.forEach(car => {
            car.setY(car.getY() - deslocamento)
            if(car.getY() < -car.getAltura()){
                car.setY(car.getY() + espaco * this.cars.length)
                car.sortearPosicao()
            }
        })
    }
}


const carros = new Carros(390,1000,500)

carros.cars.forEach(car => {
    document.querySelector('[racer]').appendChild(car.elemento)
})

setInterval(() => {
    carros.animar()
},20)


