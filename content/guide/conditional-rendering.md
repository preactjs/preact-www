
# Conditional Rendering

so you can use conditions in component rendering, you can use the following ways.

## Using If and Else

This way you can use an alternative if the component is not ready to render

```js

class UserList extends Component{

    

    renderUsers(){
        return this.props.data.users.map(user =>(
            <li>{ user.firstname }</li>
        ));
    }
    render(){
        
 if(this.props.data.loading){return <div>Loading ..... </div> ;};

        return(
            <div>Lista de Usuarios <br/>
                <ul>
                    {this.renderUsers()}

                </ul>
            </div>
        )
    }
}
```

## Using Logic in template render


But we also have a faster way, and can show the component only if it's ready

```js

class UserList extends Component{


    renderUsers(){
        return this.props.data.users.map(user =>(
            <li>{ user.firstname }</li>
        ));
    }
    render(){
        
    return(
            <div>Lista de Usuarios <br/>
                <ul>
                    { !this.props.data.loading && 
                    this.renderUsers()
                    }

                </ul>
            </div>
        )
    }
}
```