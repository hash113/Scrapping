import os,json
import csv,sys
import operator
from collections import Counter
from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from werkzeug import secure_filename

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload( row = None):
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        r = csv.reader(open(filename))
        line1=r.next() #Colum heading first line
        return render_template('choice.html' ,line1=line1)

        # namelist=[]
        # citylist=[]
        # genderlist=[]
        # agelist=[]
        # mixlist=[]
        # reader = csv.DictReader(open(filename))
        # for row in reader:
        #     namelist.append(row[line1[0]])
        #     agelist.append(row[line1[1]])
        #     genderlist.append(row[line1[2]])
        #     citylist.append(row[line1[3]])

        # # agelist = agelist.sort()
        # # agelist = str(agelist).strip('[]')
        # agelist.sort()
        # agelist1 = str(agelist)
        # # print agelist1
        # reader1 = csv.DictReader(open(filename))
        # jsonage=json.dumps(agelist)
        
        # counts  = Counter(genderlist)
        # malecount=counts['Male']
        # femalecount=counts['Female']

        # ########## sorting according to the column
        # data = csv.reader(open(filename),delimiter=',')
        # # sortedlist0 = sorted(data, key=operator.itemgetter(0), reverse=True)
        # # sortedlist1 = sorted(data, key=operator.itemgetter(1), reverse=True)
        # # sortedlist2 = sorted(data, key=operator.itemgetter(2), reverse=True)
        # sortedlist3 = sorted(data, key=operator.itemgetter(3), reverse=True)
        # ########## removing the first element containing the Name and other list ids
        # # sortedlist1.remove(line1) 
        # # sortedlist2.remove(line1) 
        # sortedlist3.remove(line1) 
        # # sortedlist0.remove(line1) 
        # # print sortedlist3
        # # countsc = Counter(sortedlist3)

        # ###### finding how many male in delhi
        # reader42 = csv.DictReader(open(filename))
        # delhimale = 0
        # totaldelhirows = 0
        # for row in reader42:
        #     if row[line1[3]]=="Delhi":
        #         if row[line1[2]]=="Male":
        #             delhimale = delhimale+1
        #         totaldelhirows = totaldelhirows+1
        # # print delhimale
        # delhif = totaldelhirows - delhimale

        # mumf=femalecount- delhif
        # mumm=malecount-delhimale
        
        # # with open(filename, 'rb') as f:
        # #     reader = csv.reader(f)
        # #     try:
        # #         for row in reader:
        # #             print row
        # #     except csv.Error as e:
        # #         sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))
        # # return render_template('graph.html' , row=line1, age=jsonage,name=namelist, gender=genderlist,city=citylist )

        # ########## return a graph of gender column ( customization can be done for all column/specific column)
        # # return render_template('line.html' ,malec=malecount, femalec=femalecount ) 
        
        # ########## this makes a bar chart of gender vs city
        # return render_template('bar.html' ,delhim=delhimale, delhif=delhif,mumf=mumf,mumm=mumm )

@app.route('/vselection', methods=['POST'])
def vselection():
    selectedCheckbox =  request.form.getlist("csvcolumn") #variables of csv, selected checkbox 
    # print selectedCheckbox
    if len(selectedCheckbox)>1:
        graph="bar.html"
    else:
        graph="line.html"
    return render_template('typeselector.html') #graph type selector    

if __name__ == '__main__':
    app.run(debug=True)
