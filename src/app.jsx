const contentNode = document.getElementById('contents');

class ProductRow extends React.Component 
{
render() {
		return(
		<tr>
			<td>{this.props.product.Name}</td>
			<td>${this.props.product.Price}</td>
			<td>{this.props.product.Category}</td>
			<td><a href={this.props.product.Image} target="blank">View</a></td>
		</tr>
		);
	}
}
class ProductAdd extends React.Component {
  constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.productAdd;
	 	
        this.props.createProduct({
            Name: form.product.value,
            Price: form.price.value.slice(1),
            Category: form.category.value,
            Image: form.image.value,
        });
    // clear the form for the next input
        form.price.value = "$";
        form.product.value = "";
        form.image.value = "";
    }

    render() {
        return (
            <div>
                <form name="productAdd" onSubmit={this.handleSubmit}>
                    <div>
                        <label >Category </label>
                        <select name="category">
                            <option value="Shirt">Shirts</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Jacket">Jackets</option>
                            <option value="Sweater">Sweaters</option>
                            <option value="Accessories">Accessories</option>
                        </select><br />
                        <label>Price Per Unit </label>
                        <input type="text" name="price" /><br />
                    </div>
                    <div>
                        <label>Product Name</label>
                        <input type="text" name="product" /><br />
                        <label>Image URL</label>
                        <input type="text" name="image" /><br />
                    </div>
                    <button>Add Product</button>
                </form>
            </div>
        );
    }
}


function ProductTable(props) {
    const productRows = props.products.map(product => <ProductRow key={product.id} product={product} />);

   return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Image</th>
                </tr>
            </thead>
            
            <tbody>{productRows}</tbody>
        </table>
    );
}







class ProductList extends React.Component 
{
    constructor() 
    {
         super();
         this.state = { products: [] };
         this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() 
    {
        document.forms.productAdd.price.value = '$';
        this.loadData();
    }

    async loadData() 
    {
        const query = `query{
            productList{
                id Name Price Image Category
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        
		const result = await response.json();
        this.setState({ products: result.data.productList })
    }

    async createProduct(newProduct) 
    {
        const newProducts = this.state.products.slice();
        newProduct.id = this.state.products.length + 1;
        newProducts.push(newProduct);
        this.setState({ products: newProducts });
        const query = `mutation {
            productAdd(product:{
              Name: "${newProduct.Name}",
              Price: ${newProduct.Price},
              Image: "${newProduct.Image}",
              Category: ${newProduct.Category},
            }) {
              id
            }
          }`;
        


	const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
	
	
        this.loadData();
    }

    render() 
    {
        return (
            <div>
                <h1>My Company Inventory</h1>
                <div>Showing all available products</div>
                <hr /><br />
                <ProductTable products={this.state.products} />
                <br />
                <div>Add a new product to inventory</div>
                <hr /><br />
                <ProductAdd createProduct={this.createProduct} />
            </div>
        );
    }
}


ReactDOM.render(<ProductList />, contentNode);  // Render the component inside the content Node