import '../styles/Loading.css'

const Loading = ({width='200px', height='30px'}) => {
  return (
    <span className="loader" style={{width, height}}></span>
  )
}

export default Loading