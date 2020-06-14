import '../styles/App.css'
import '../styles/Components.css'
import '../styles/NewsCard.css'
import '../styles/Setting.css'

import NavBar from "../components/NavBar.js"
import CovidWireHead from "../components/CovidWireHead.js"

export default function App({ Component, pageProps }) {
  return(
		<>
			<CovidWireHead/>
			<Component {...pageProps} />
			<NavBar/>
		</>
  )
}
