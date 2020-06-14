import config from '../../components/config.js'
import {urlEncode,urlDecode} from '../../components/utils.js'


export default function SectionFeed({postData}){
	return (
		<div>{postData}</div>
	)
}


export async function getStaticPaths() {
	const paths = config.domain.map(x=>(
		{
			params: {
				section: urlEncode(x)
			}
		}
	))
	return {
		paths,
		fallback: false
	}
}


export async function getStaticProps({ params }) {
	const postData = params.section
  	return {
    	props: {
      		postData
    	}
  	}
}
