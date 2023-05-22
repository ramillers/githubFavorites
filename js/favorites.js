// classe q vai conter a lógica dos dados
// como os dadso serão estruturados
export class Favorites {
    constructor(root) //root será o app
    this.root = document.querySelector(root) //nada mais é que a div "app"
}

// classe q vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.update()
    }

    update() {
        this.removeAllTr()
    }

    removeAllTr() {
        const tbody = this.root.querySelector 
        ('table tbody')

        tbody.querySelectorAll('tr')
            .forEach((tr) => {
            tr.remove()
        })
    }
}

