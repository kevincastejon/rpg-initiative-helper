import React, {
  Component
} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemEditingId: "",
    };
  }
  readFileAsDataURL(file) {
    return new Promise((resolve,reject) => {
       let fileredr = new FileReader();
       fileredr.onload = () => resolve(fileredr.result);
       fileredr.onerror = () => reject(fileredr);
       fileredr.readAsDataURL(file);
    });
  }
  render() {
    const {
      items,
      itemEditingId
    } = this.state;
    const editingName = itemEditingId.length > 0 ? items.find((itm)=>itm.id === itemEditingId).name : "";
    const editingAvatar = itemEditingId.length > 0 ? items.find((itm)=>itm.id === itemEditingId).avatar : "";
    const editingInitiative = itemEditingId.length > 0 ? items.find((itm)=>itm.id === itemEditingId).initiative : 0;
    const editingRollDice = itemEditingId.length > 0 ? items.find((itm)=>itm.id === itemEditingId).rollDice : 0;
    const editingRollBonus = itemEditingId.length > 0 ? items.find((itm)=>itm.id === itemEditingId).rollBonus : 0;
    return(
    <div>

    <div style={{position:'absolute', top:0,left:0,right:0,bottom:0}}
    onDrop={(e)=>{
        e.preventDefault();
        e.stopPropagation();
          const itms = [...e.dataTransfer.items];
          Promise.all(itms.map(async(itm)=>await this.readFileAsDataURL(itm.getAsFile()))).then((images)=>{
            const newImages =images.map((img)=>({name:"", initiative:0, avatar:img, rollDice:0, rollBonus:0, id:uuidv4()}));
            this.setState((prevState) => {
            return({
              items: [...prevState.items, ...newImages],
            });
        })}
      );
    }}
    onDragOver ={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onDragEnter ={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}>
    </div>
    <Modal
      open={itemEditingId.length>0}
      onClose={()=>this.setState({itemEditingId:''})}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <Box sx={modalStyle}>
        <label>
          <Avatar variant="square" alt={editingName} src={editingAvatar} />
          <input style={{display:'none'}} id='uploadImg' type='file' onChange={async(e)=>{
            let file = e.target.files[0];
            if(!file) return;
            let b64str = await this.readFileAsDataURL(file);
            this.setState(prevState => {
              let mutatedItems = [...prevState.items];
              mutatedItems.find((itm)=>itm.id === itemEditingId).avatar = b64str;
              return({
                items: mutatedItems
              });
            })
          }} />
        </label>
        <label>
          <span>Name </span>
          <input placeholder='Enter a name here' id='charname' type='text' value={editingName} onChange={(e)=>{
            let newName = e.target.value;
            this.setState(prevState => {
              let mutatedItems = [...prevState.items];
              mutatedItems.find((itm)=>itm.id === itemEditingId).name = newName;
              return({
                items: mutatedItems
              });
            })
          }} />
        </label>
        <br/>
        <label>
        <span>Initiative </span>
        <input id='charinitiative' type='number' value={editingInitiative} onChange={(e)=>{
          let newInitiative = parseInt(e.target.value);
          this.setState(prevState => {
            let mutatedItems = [...prevState.items];
            mutatedItems.find((itm)=>itm.id === itemEditingId).initiative = newInitiative;
            return({
              items: mutatedItems
            });
          })
        }} />
        </label>
        <br/>
        <br/>
        <p>Roll Initiative</p>
        <label>
        <input id='rollDice' type='number' value={editingRollDice} onChange={(e)=>{
          let newRollDice = parseInt(e.target.value);
          this.setState(prevState => {
            let mutatedItems = [...prevState.items];
            mutatedItems.find((itm)=>itm.id === itemEditingId).rollDice = newRollDice;
            return({
              items: mutatedItems
            });
          })
        }} />
          <span>d6</span>
        </label>
        <span> + </span>
        <label>
        <input id='rollDice' type='number' value={editingRollBonus} onChange={(e)=>{
          let newRollBonus = parseInt(e.target.value);
          this.setState(prevState => {
            let mutatedItems = [...prevState.items];
            mutatedItems.find((itm)=>itm.id === itemEditingId).rollBonus = newRollBonus;
            return({
              items: mutatedItems
            });
          })
        }} />
        </label>
        <Button onClick={()=>{
          let score = 0;
          for (var i = 0; i < editingRollDice; i++) {
            score += Math.ceil(Math.random()*6);
          }
          score += editingRollBonus;
          this.setState(prevState => {
            let mutatedItems = [...prevState.items];
            mutatedItems.find((itm)=>itm.id === itemEditingId).initiative = score;
            return({
              items: mutatedItems
            });
          });
        }}>
        Roll
        </Button>
      </Box>
    </Modal>
        <Button onClick={()=>{
          this.setState(prevState => {
            const id = uuidv4();
            return({
            items: [...prevState.items, {name:"", initiative:0, avatar:"", rollDice:0, rollBonus:0, id:id}],
            itemEditingId : id
          })});
        }}>
        Add
        </Button>
        <Button onClick={(e)=>{
          for (let i = 0; i < items.length; i++) {
            let score = 0;
            for (var j = 0; j < items[i].rollDice; j++) {
              score += Math.ceil(Math.random()*6);
            }
            score += items[i].rollBonus;
            items[i].initiative = score;
          }
          this.setState({items : items});
        }}>Re-Roll All</Button>
        <Button onClick={(e)=>{
          for (let i = 0; i < items.length; i++) {
            items[i].initiative = Math.max(items[i].initiative-10, 0);
          }
          this.setState({items : items});
        }}>-10 All</Button>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {items.sort((a,b)=>a.initiative<b.initiative?1:-1).map((item, id)=>(
          <ListItem key={id} alignItems="flex-start">
          <ListItemButton onClick={()=>this.setState({itemEditingId:item.id})}>
                 <ListItemAvatar>
                   <Avatar variant="square" alt={item.name} src={item.avatar} />
                 </ListItemAvatar>
                 <ListItemText
                   primary={item.name}
                   secondary={"Initiative : "+item.initiative}
                 />
          </ListItemButton>
               </ListItem>
          ))}
        </List>
    </div>
    )
  }
}
export default App;


// <div style={{position:'absolute', top:0,left:0,right:0,bottom:0, backgroundColor:'blue'}}
// onDrop={(e)=>{
//     e.preventDefault();
//     e.stopPropagation();
//     this.setState(async(prevState) => {
//       const newItems = [];
//       for (let i = 0; i < e.dataTransfer.items.length; i++) {
//         newItems.push({name:"", initiative:0, avatar:await this.readFileAsDataURL(e.dataTransfer.items[i].getAsFile()), rollDice:0, rollBonus:0, id:uuidv4()});
//         console.log(e.dataTransfer.items[i].getAsFile());
//       }
//       return({
//       items: [...prevState.items, newItems],
//     })});
// }}
// onDragOver ={(e) => {
//   e.preventDefault();
//   e.stopPropagation();
// }}
// onDragEnter ={(e) => {
//   e.preventDefault();
//   e.stopPropagation();
// }}>
// </div>




// import * as React from 'react';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import Divider from '@mui/material/Divider';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
//
// const items = [{name:"Javier", initiative:6, avatar:""}, {name:"JC", initiative:10, avatar:""}, {name:"Franco", initiative:2, avatar:""}];
//
// function readFileAsDataURL(file) {
//   return new Promise((resolve,reject) => {
//      let fileredr = new FileReader();
//      fileredr.onload = () => resolve(fileredr.result);
//      fileredr.onerror = () => reject(fileredr);
//      fileredr.readAsDataURL(file);
//   });
// }
//
// export default function BasicList() {
//   return (
//     <div>
//         <input id='uploadImg' type='file' onChange={async(e)=>{
//           let file = e.target.files[0];
//           if(!file) return;
//           let b64str = await readFileAsDataURL(file);
//           items.push({name:"XXX", initiative:parseInt(Math.random()*100), avatar:b64str});
//         }} />
//         <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//         {items.sort((a,b)=>a.initiative<b.initiative).map((item)=>(
//           <ListItem alignItems="flex-start">
//                  <ListItemAvatar>
//                    <Avatar alt={item.name} src={item.avatar} />
//                  </ListItemAvatar>
//                  <ListItemText
//                    primary={item.name}
//                    secondary={item.initiative}
//                  />
//                </ListItem>
//           ))}
//         </List>
//     </div>
//   );
// }
