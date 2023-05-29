import { GithubUser } from "./GithubUser.js"

// classe contendo a lógica de como os dados serão estruturados na tabela
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root) // passando o root que deseja utilizar
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        /*
            - o parse vai modificar um JSON para o objeto que está dentro do JSON
            - || [] para garantir que o entries seja um array
            - o entries será carregado no momento que for passado o app para dentro da FavoritesView
            - vai no super, cria o root, entra no this.root da Favorites, passa o root e carrega os dados
            - o this.entries existe a partir da linha do super
        */
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        // JSON.stringify vai transformar um objeto que está no JS para um objeto tipo JSON em string
    }

    async add(username) {
        try {
            // Higher-order functions (map, filter, find, reduce) recebem funções como argumento ou retornam funções como argumento
            // respeitam o princípio da imutabilidade da programação funcional
            const userExists = this.entries.find(entry => entry.login === username)
            // se encontrar o user, retorna verdadeiro, pega a entrada e devolve como um objeto no userExists

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
           
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
       

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()
        
        this.entries.forEach( user => {
            
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOK = confirm('Tem certeza que deseja deletar essa linha?')

                if(isOK) {
                    this.delete(user)
                }
            }

            this.tbody.append(row) // recebe um elemento HTML da DOM
        })
    }

    createRow() {
        const tr = document.createElement('tr') // o tr precisa ser criado pela DOM
        
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/guialvess.png" alt="Imagem de guilherme Alves">
                <a href="https://github.com/guialvess" target="_blank">
                    <p>Guilherme Alves</p>
                    <span>guialvess</span>
                </a>
            </td>
            <td class="repositories">20</td>
            <td class="followers">18</td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `
        return tr
    }

    removeAllTr() {        
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}