import Head from 'next/head'

function CovdWireHead(props) {
  return (
    <Head>
        <title>{props.pageName + " - CovidWire"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
		<link href="https://fonts.googleapis.com/css?family=Baloo+2|Baloo+Bhai+2|Baloo+Bhaina+2|Baloo+Chettan+2|Baloo+Da+2|Baloo+Tamma+2|Baloo+Tammudu+2|Baloo+Thambi+2&display=swap" rel="stylesheet"/>
		<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
		<meta name="description" content="Authentic, verified and factful information about Covid-19 pandemic in an easy to read and share format, in multiple regional languages."
    	/>
      </Head>
  )
}

export default CovdWireHead
