import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('firebase-admin-cred.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://covidwire.firebaseio.com'
})

#-----------------------

db_blog = db.reference('/blog')


prismic_url="http://covidwire.cdn.prismic.io/api/v2"
record_path="/documents/search?ref="


ref = requests.get(prismic_url)
ref = ref.json()["refs"][0]["ref"]

content = requests.get(prismic_url+record_path+ref)
content = content.json()["results"]



def format_body(raw):
	tag={
		'strong':['<b>','</b>'],
		'em':['<i>','</i>'],
		'heading2':['<h3>','</h3>']
	}
	body=""
	for text in raw:
		section=''
		if text['type']=='paragraph':

			if len(text['spans'])==0:
				body+=text['text']
				body+="<br/>"
				continue
			span_ind=[0]+flatten_list([[x['start'],x['end']] for x in text['spans']])
			span_val=flatten_list([[tag[x['type']][0],tag[x['type']][1]] for x in text['spans']])
			parts = [text['text'][i:j] for i,j in zip(span_ind, span_ind[1:]+[None])]

			merged=count_list(parts,span_val)[:-1]
			body+=''.join(merged)
			body+="<br/>"
			continue

		if text['type']=='heading2':
			section=tag['heading2'][0]+text['text']+tag['heading2'][1]
			body+=section

	return body.replace('\n','<br/>')


def flatten_list(y):
	return [x for a in y for x in flatten_list(a)] if type(y) is list else [y]

def count_list(lst1, lst2):
    return [item for pair in zip(lst1, lst2+[0])
                                 for item in pair]

def format_links(raw):
	if len(raw)==0:return ''

	span_ind=[0]+flatten_list([[x['start'],x['end']] for x in raw[0]['spans']])
	span_val=flatten_list([['<a href="'+x['data']['url']+'">','</a>'] for x in raw[0]['spans']])

	parts = [raw[0]['text'][i:j] for i,j in zip(span_ind, span_ind[1:]+[None])]

	merged=count_list(parts,span_val)[:-1]
	return ''.join(merged).replace('\n','<br/><br/>')


def pull_blog(requests):
	blog_meta={}
	blog_content={}
	for post in content:
		blog={
			'order':int(post['data']['order']),
			'title':post['data']['title'][0]['text'],
			'authors':post['data']['authors'][0]['text'],
			'image':post['data']['image']['url'],
		}
		blog_meta['csw'+str(blog['order'])]=blog.copy()

		blog['date']=post['data']['date'],
		blog['minutes']=int(post['data']['minutes']),
		blog['body']=format_body(post['data']['body'])
		blog['author_bio']=format_body(post['data']['author_bio'])
		blog['link']=format_links(post['data']['links'])
		blog_content['csw'+str(blog['order'])]=blog

	db_blog.child('list').set(blog_meta)
	db_blog.child('content').set(blog_content)
