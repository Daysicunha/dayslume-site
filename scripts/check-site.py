"""Static integrity checks for this HTML site; does not replace browser QA."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import re
ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.ids=[]; self.refs=[]; self.h1=0; self.errors=[]; self.metas=[]
        self.feed(source)
    def handle_starttag(self, tag, pairs):
        a=dict(pairs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='meta': self.metas.append(a.get('name') or a.get('property'))
        if tag=='img' and 'alt' not in a: self.errors.append('Image without alt')
        if a.get('target')=='_blank' and 'noopener' not in a.get('rel',''): self.errors.append('External tab without noopener')
        for k in ['src','href']:
            if k in a: self.refs.append(a[k])
        if tag=='button' and not a.get('type'): self.errors.append('Button without explicit type')
pages={p:Page(p.read_text()) for p in ROOT.rglob('*.html') if '.git' not in p.parts}
errors=[]; references=0
for path,page in pages.items():
    label=str(path.relative_to(ROOT))
    errors += [f'{label}: {e}' for e in page.errors]
    if page.h1!=1: errors.append(f'{label}: expected one h1, found {page.h1}')
    for id,n in Counter(page.ids).items():
        if n>1: errors.append(f'{label}: duplicate id {id}')
    for key in ['description','theme-color','robots','og:title','og:description','og:type','og:locale']:
        if page.metas.count(key)!=1: errors.append(f'{label}: metadata {key} count != 1')
    for ref in page.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:continue
        if not ref or ref=='#':errors.append(f'{label}: empty link');continue
        target=(path.parent/unquote(u.path)).resolve() if u.path else path
        references+=1
        if not target.exists(): errors.append(f'{label}: missing {ref}')
        if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{label}: missing anchor {ref}')
for css in (ROOT/'assets/css').glob('*.css'):
    for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)',css.read_text()):
        if urlsplit(ref).scheme:continue
        if not (css.parent/ref).resolve().exists():errors.append(f'{css.name}: missing {ref}')
if errors:
    print('\n'.join(errors));raise SystemExit(1)
print(f'PASS: {len(pages)} HTML pages, {references} local references; metadata, anchors, IDs, image alternatives and external tab safety.')
