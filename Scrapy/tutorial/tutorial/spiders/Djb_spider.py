from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

from tutorial.items import DmozItem

class DmozSpider(BaseSpider):
  name = "dmoz"
  allowed_domains = ["dmoz.org"]
  start_urls = [
  "http://www.djangobook.com/en/2.0/chapter02.html"
  ]

  def parse(self, response):
    f=open('test.txt','w')
    hxs = HtmlXPathSelector(response)
    sites = hxs.select('//pre')
    items = []
    for site in sites:
      item = DmozItem()
      item['title'] = site.select('a/text()').extract()
      item['link'] = site.select('a/@href').extract()
      item['desc'] = site.select('text()').extract()
      item['code'] = site.select('text()').extract()
      items.append(item)
    print "heere i am " 
    print items
    return items
