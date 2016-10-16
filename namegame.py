import os,sys,stat
import collections
from collections import defaultdict


filelist= []
list2=[]
newline=[]
filedict=defaultdict(list)
address="/Users/harshbhatia/Downloads"


def display_choice(filedict,duplicate,file_number):
	print "The file is present in the following location"
	exact_file= int(file_number)-1
	for z in range(0,len(filedict[duplicate[exact_file]])):
		print "location-" + str(z+1) + " @ " + filedict[duplicate[exact_file]][z]
	print "Enter number of location of file to be deleted"
	print "OR press X to exit"
	num=raw_input()
	return num


for files in os.walk(address):
	for i in range(0,len(files[2])):
		if files[2][i][0]!=".":
			filelist.append(files[2][i].lower())
			newline=(files[2][i],files[0])
			list2.append(newline)

filelist = sorted(filelist)
for k, v in list2:
	filedict[k].append(v)

duplicate=[x for x, y in collections.Counter(filelist).items() if y > 1]

#------ Program starts the display from here --------------


def looper(filedict,duplicate):
	print "NameGamePy"
	duplicate.sort()
	for i in range(0,len(duplicate)):
		print str(i+1) + " " + duplicate[i]
	print "\n Enter file number of file to be deleted"
	print "or press anyother to exit"
	print "PLEASE DO NOT DELETE FILES YOU ARE NOT AWARE OF ( SYSTEM FILES DELECTION MAY CAUSE ERROR )"
	file_number=raw_input()
	while (len(filedict [duplicate[int(file_number)-1]])>0):
		print str(len(filedict [duplicate[int(file_number)-1]]) )+ "locations"
		print "press any string to exit" 
		if file_number!= "b":

			duplicate_file_location_no = display_choice(filedict,duplicate,file_number)  # ------ Display and select choice function call ------
			if duplicate_file_location_no != "x":
				print filedict[ duplicate[int(file_number)-1]][int(duplicate_file_location_no)-1] + "/" +duplicate[int(file_number)-1]
				os.system("rm " + filedict[ duplicate[int(file_number)-1]][int(duplicate_file_location_no)-1] + "/" +duplicate[int(file_number)-1] )
				print "FILE DELETED !!"

			else:
				break
	##

looper(filedict,duplicate)