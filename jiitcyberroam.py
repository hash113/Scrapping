import mechanize
br = mechanize.Browser()
 
#try:
br.open('http://172.16.68.6:8090/httpclient.html')
forms = br.forms()
print 'Forms:'
'''
	for form in forms:
		print 'form', form
		# Force try using the expected form
		br.select_form(name="form")
		br["usern"] = "test_name"
		br["passw"] = "test_pass"
		response = br.submit()
		content = response.get_data()
		br.close()
 
	except urllib2.HTTPError, e:
		sys.exit("%d: %s" % (e.code, e.msg))
	except IOError, e:
		print e
	except:
		pass
'''