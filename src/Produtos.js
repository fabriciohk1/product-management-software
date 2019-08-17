import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import ProdutosHome from './ProdutosHome'
import ProdutosNovo from './ProdutosNovo'
import ProdutosEditar from './ProdutosEditar'
import Categoria from './Categoria' 

class Produtos extends Component {
    constructor (props) {
        super(props)

        this.renderCategoria = this.renderCategoria.bind(this)
        this.handleNewCategoria = this.handleNewCategoria.bind(this)
        this.editCategoria = this.editCategoria.bind(this)
        this.cancelEditing = this.cancelEditing.bind(this)
        this.handleEditCategoria = this.handleEditCategoria.bind(this)
        
        this.state = {
            editingCategoria: ''
        }
    }
    
    componentDidMount() {
        this.props.loadCategorias()        
    }

    editCategoria(categoria) {
        this.setState({
            editingCategoria: categoria.id
        })
    }

    cancelEditing() {
        this.setState({
            editingCategoria: ''
        })
    }
    
    renderCategoria(cat) {
        return(
            <li key={cat.id}>
                {this.state.editingCategoria === cat.id &&
                <div className='input-group'>
                    <div className='input-group-btn'>
                        <input ref={'cat-' + cat.id} className='form-control' type='text' defaultValue={cat.categoria} 
                            onKeyUp={this.handleEditCategoria} />
                        <button className='btn' onClick={this.cancelEditing}>cancel</button>
                    </div>
                </div>}
                {this.state.editingCategoria !== cat.id &&
                <div>
                    <button className='btn btn-sm' onClick={() => this.props.removeCategoria(cat)}>
                        <span className='glyphicon glyphicon-remove'></span>
                    </button>
                    <button className='btn btn-sm' onClick={() => this.editCategoria(cat)}>
                        <span className='glyphicon glyphicon-pencil'></span>
                    </button>
                    <Link to={`/produtos/categoria/${cat.id}`}>{cat.categoria}</Link>  
                </div>}                             
            </li>
        )
    }

    handleNewCategoria(key) {
        if (key.keyCode === 13) {
           this.props.createCategoria({               
                categoria: this.refs.categoria.value                
           })
           
           this.refs.categoria.value = ''                    
        }        
    }

    handleEditCategoria(key) {
        if (key.keyCode === 13) {
            this.props.editCategoria({
                id: this.state.editingCategoria,
                categoria: this.refs['cat-' + this.state.editingCategoria].value               
            })

            this.setState({
                editingCategoria: ''
            })  
        }
    }

    render() {
        const { match, categorias } = this.props        
        return(
            <div className='row'>
                <div className='col-md-2'>
                    <h3>Categorias</h3>
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {categorias.map(this.renderCategoria)}                    
                    </ul>    
                    <div className='well well-sm'>
                        <input type='text' className='form-control' ref='categoria' 
                               placeholder='Nova categoria' onKeyUp={this.handleNewCategoria} />
                    </div>   
                    <Link to='/produtos/novo'>Novo Produto</Link>
                </div>
                <div className='col-md-10'>
                    <h1>Produtos</h1>
                    <Route exact path={match.url} component={ProdutosHome} />
                    <Route exact path={match.url+'/novo'} 
                           render={(props) => {
                               return <ProdutosNovo {...props} 
                                        categorias={categorias}
                                        createProduto={this.props.createProduto} />
                           }} />
                    <Route path={match.url+'/editar/:id'}
                           render={(props) => {
                               return <ProdutosEditar {...props}
                                        categorias={categorias}
                                        readProduto={this.props.readProduto}
                                        editProduto={this.props.editProduto}
                               />
                           }}
                    />                           
                    <Route path={match.url+'/categoria/:catId'} 
                           render={(props) => {
                               return <Categoria {...props} 
                                loadProdutos={this.props.loadProdutos}
                                loadCategoria={this.props.loadCategoria}
                                produtos={this.props.produtos}
                                categoria={this.props.categoria}
                                removeProduto={this.props.removeProduto}
                                />
                           }} />                    
                </div>
            </div> 
        )        
    }
}

export default Produtos