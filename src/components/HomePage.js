import React, { Component } from 'react'
import axios from 'axios'

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            file: null,
            id: 0
        }
    }
    async componentDidMount () {
        const response = await axios.get('https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/allBanners');
        console.log(response.data);
        this.setState({banners: response.data.banners});
    }
    submit = async (id)=>{
        console.log(id);
        var reader = new FileReader();
        reader.readAsDataURL(this.state.file[0]);
        reader.onload = async ()=>{
            const formData = new FormData();
            formData.append("files", this.state.file[0]);
            const response = await axios.post('https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/uploadImagesOGC', formData);
            console.log(response.data);
            const data = {
                mobile_image: response.data.url
            }
            const response2 = await axios.post(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/editBanner/${id}`, data);
            console.log(response2.data);
            const response4 = await axios.get(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/allBanners`); 
            this.setState({id: 0, banners: response4.data.banners});
        }
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    remove= async (id)=> {
        console.log(id);
        const data = {
            mobile_image: null,
        }
        const response2 = await axios.post(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/editBanner/${id}`, data);
        console.log(response2.data);
        const response4 = await axios.get(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/allBanners`); 
        this.setState({id: 0, banners: response4.data.banners});
    }
    
  render() {
    return (
      <div className="container">
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Image</th>
                <th scope="col">Mobile Image</th>
                <th scope="col">is banner</th>
                <th scope="col">is mainpage</th>
                <th scope="col">service_id</th>
                <th scope="col">SubService_id</th>
                </tr>
            </thead>
            <tbody>
                {this.state.banners.map((item, index) =>{
                    return <tr key={index}>
                        <th scope="row">{item.banner_id}</th>
                        <td><a href={item.image} target="_blank"><img src={item.image} height={70} width={120} /></a></td>
                        <td>
                            {item.mobile_image !== null ?
                            <><a href={item.mobile_image} target="_blank"><img src={item.mobile_image} height={70} width={100} /></a>
                            <button className="btn btn-outline-primary mx-4" onClick={()=> this.remove(item.banner_id)}>Remove Image</button></>
                            : null}
                            <> <input type="file" onChange={(e)=> this.setState({file: e.target.files, id: item.banner_id})}/>
                            {item.banner_id === this.state.id && this.state.file && [...this.state.file].map((file, index)=>(
                                <><img key={index} src={URL.createObjectURL(file)} height={70} width={100}/>
                                <button className="btn btn-outline-success mx-3" onClick={()=> this.submit(item.banner_id)}>UploadImage</button></>
                            ))}
                            </>
                            
                        </td>
                        <td>
                            <input type="checkbox" defaultChecked={item.is_banner} />
                        </td>
                        <td><input type="checkbox" defaultChecked={item.is_banner} /></td>
                        <td>{item.service_id}</td>
                        <td>{item.sub_service_id}</td>
                    </tr>
                })}
                
            </tbody>
            </table>
      </div>
    )
  }
}

export default HomePage