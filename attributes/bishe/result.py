#!/usr/bin/env python
# coding=utf-8
def getAttributesFromResult(file_path):
    file = open(file_path,'r')
    result = []
    temp_str = ""
    for line in file.readlines():
        line_list = line.split("\t")
        #print line_list
        cur_char = line_list[len(line_list) - 1]
        #print cur_char
        #cur_char[0]是因为标签后面带了换行符\n
        if cur_char[0] == 'N':
            #print "The char is 'N'"
            continue
        elif cur_char[0] == 'S':
            result.append(line_list[0])
        elif cur_char[0] == 'B':
            temp_str += line_list[0]
            continue
        elif cur_char[0] == 'M':
            temp_str += line_list[0]
            continue
        elif cur_char[0] == 'E':
            temp_str += line_list[0]
            result.append(temp_str)
            temp_str = ""
    return result
res = getAttributesFromResult('/home/pb/bishe/test.rst')
res_sort = list(set(res))
res_sort.sort(key = res.index)
for item in res_sort:
    print item
print len(res_sort)
