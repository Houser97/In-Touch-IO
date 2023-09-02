import '../styles/Loading.css'

const Loading = ({width='200px', height='30px', owner=false}) => {
  return (
    <span className={`loader ${owner ? 'right' : 'left'}`} style={{width, height}}></span>
  )
}

export default Loading