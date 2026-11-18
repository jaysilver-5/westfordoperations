"""One-off content extraction from the provided Westford HTML reference.
The generated content.json is checked into the Next.js project, so this script is
not required at runtime; the original source HTML need not be shipped.
"""
from bs4 import BeautifulSoup
from pathlib import Path
import json
import sys

source=Path(sys.argv[1]) if len(sys.argv)>1 else Path('reference.html')
if not source.is_file():
    raise SystemExit('Usage: python extract_source.py /path/to/Westford-preview.html (requires beautifulsoup4)')
s=BeautifulSoup(source.read_text(),'html.parser')

def t(el):return el.get_text(' ',strip=True) if el else ''
def one(n,css):return n.select_one(css) if n else None
def items(n,css):return [t(x) for x in n.select(css)] if n else []
def intro(n):
 return {'eyebrow':t(one(n,'.eyebrow')),'title':t(one(n,'h1,h2')),'description':t(one(n,'.section-description, .subpage-intro, .subpage-description, .review-description, .hero-description'))}
def action(el):
 if not el: return None
 return {'label':t(el),'href':el.get('href'), 'mode':el.get('data-enquiry'),'service':el.get('data-prefill-service'),'audience':el.get('data-prefill-audience')}
def faq(n):
 return {'intro':intro(one(n,'.faq-intro, .centred-intro')),'items':[{'q':t(one(x,'summary')),'a':t(one(x,'p'))} for x in n.select('.faq-item')]}
def cta(n):
 return {'intro':intro(n),'action':action(one(n,'button[data-enquiry], a.button'))}
def cards(n,card):
 result=[]
 for el in n.select(card):
  btn=one(el,'a,button')
  result.append({'title':t(one(el,'h3')),'description':t(one(el,'p')),'action':action(btn)})
 return result

home=s.select_one('[data-page-view="home"]')
sections=home.find_all('section',recursive=False)
hero,everyday,service_home,engagement,agency_home,principles,review=sections
D={'home':{
 'hero':intro(hero),
 'everyday':{'intro':intro(everyday),'items':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in everyday.select('.workflow-item')], 'close':t(one(everyday,'.workflow-close p'))},
 'services':{'intro':intro(service_home),'items':[{**x,'key':el.get('data-service'),'icon':idx} for idx,(x,el) in enumerate(zip(cards(service_home,'.service-item'),service_home.select('.service-item button[data-service]')))], 'note':t(one(service_home,'.services-bottom p'))},
 'process':{'intro':intro(engagement),'items':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in engagement.select('.process-step')]},
 'agency':{'intro':intro(agency_home),'items':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in agency_home.select('.agency-points article')]},
 'principles':{'intro':intro(principles),'items':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in principles.select('.principles-grid article')]},
 'review':cta(review)
}}
S=s.select_one('[data-page-view="services"]')
ss=S.find_all('section',recursive=False)
hero_s,scopes_sec,approach_sec,faq_sec,cta_sec=ss
D['services']={
 'hero':intro(hero_s),
 'scopes':[{ 'id':x.get('id'), 'key':x.get('id').replace('scope-',''), 'eyebrow':t(one(x,'.eyebrow')), 'title':t(one(x,'h2')), 'description':t(one(x,'.scope-intro p:last-child')), 'tasks':items(x,'.scope-tasks li'), 'condition':t(one(x,'.scope-condition')),'action':action(one(x,'button'))} for x in scopes_sec.select('.scope-row')],
 'approach':{'intro':intro(approach_sec),'columns': [{'title':t(one(x,'h3')),'tasks':items(x,'li')} for x in approach_sec.select('.scope-approach-column')], 'note':t(one(approach_sec,'.container > .scope-condition'))},
 'faq':faq(faq_sec), 'cta':cta(cta_sec)
}
for route in ['agencies','brands']:
 v=s.select_one('[data-page-view="'+route+'"]');ss=v.find_all('section',recursive=False)
 h,split,support,workflow,questions,c=ss
 D[route]={
  'hero':intro(h),
  'split':{'intro':intro(one(split,'.audience-section-intro')),'points':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in split.select('.audience-points li')]},
  'support':{'intro':intro(one(support,'.centred-intro')), 'items':cards(support,'.audience-service')},
  'workflow':{'intro':intro(one(workflow,'.centred-intro')),'items':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in workflow.select('.audience-steps li')],'footnote':t(one(workflow,'.audience-footnote'))},
  'faq':faq(questions),'cta':cta(c)
 }
A=s.select_one('[data-page-view="about"]');ss=A.find_all('section',recursive=False)
h,statement,p,aud,c=ss
D['about']={
 'hero':intro(h),
 'statement':{'intro':intro(one(statement,'.section-intro, .audience-section-intro')),'paragraphs':items(statement,'.about-copy p')},
 'principles':{'intro':intro(one(p,'.centred-intro')),'items':[{'title':t(one(x,'h3')),'description':t(one(x,'p'))} for x in p.select('.principle-detail')]},
 'audiences':{'intro':intro(one(aud,'.centred-intro')),'items':cards(aud,'.about-audience')},
 'cta':cta(c)
}
C=s.select_one('[data-page-view="contact"]');ss=C.find_all('section',recursive=False)
h,body,question=ss
D['contact']={
 'hero':intro(h),
 'contexts': {},
 'faq':faq(question),
}
for mode in ['review','general']:
 x=one(body,f'[data-contact-{mode}]')
 D['contact']['contexts'][mode]={'intro':intro(x),'items':[{'title':t(one(y,'h3')),'description':t(one(y,'p'))} for y in x.select('.contact-benefits li')],'assurance':t(one(x,'.contact-assurance'))}

path=Path(__file__).resolve().parent / 'src/data/content.json'
path.write_text(json.dumps(D,ensure_ascii=False,indent=2)+'\n')
print('Content exported',path,round(path.stat().st_size/1024,1),'KB')
for k,v in D.items():print(k,'keys:',list(v.keys()))
print('home service keys',[(x['key'],x['title']) for x in D['home']['services']['items']])
