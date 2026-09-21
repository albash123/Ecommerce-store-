type Config=Record<string,unknown>;
type Marker={productId:string;x:number;y:number};
export function LookMarkers({config,onChange}:{config:Config;onChange:(config:Config)=>void}){
 const ids=Array.isArray(config.productIds)?config.productIds.filter((id):id is string=>typeof id==='string'):[];
 const markers=Array.isArray(config.markers)?config.markers as Marker[]:[];
 function update(productId:string,key:'x'|'y',value:number){const index=ids.indexOf(productId);const current=markers.find(m=>m.productId===productId)||{productId,x:25+index*15,y:50};onChange({...config,markers:[...markers.filter(m=>m.productId!==productId),{...current,[key]:Math.min(95,Math.max(5,value))}]});}
 return <section><h4>Product markers</h4><p>Set each marker's horizontal and vertical position as a percentage of the lifestyle image.</p>{ids.map((productId,index)=>{const marker=markers.find(m=>m.productId===productId);return <div className="form-grid" key={productId}><label>Marker {index+1} horizontal %<input type="number" min={5} max={95} value={marker?.x??Math.min(95,25+index*15)} onChange={e=>update(productId,'x',Number(e.target.value))}/></label><label>Marker {index+1} vertical %<input type="number" min={5} max={95} value={marker?.y??50} onChange={e=>update(productId,'y',Number(e.target.value))}/></label></div>;})}</section>;
}
