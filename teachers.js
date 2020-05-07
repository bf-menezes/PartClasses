const fs = require('fs')
const data = require('./data.json')
const {age, graduation, date} = require('./utils')
const Intl = require('intl')

//index
exports.index = function(req, res ){
    return res.render('teachers/index', {teachers: data.teachers})
}

// show
exports.show = function(req, res) {
    const {id} = req.params
    
    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher) return res.send ('Teacher not found!')

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth_date),
        degree: graduation(foundTeacher.degree),
        teaching_areas: foundTeacher.teaching_areas.split(','),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
    }

    return res.render('teachers/show', { teacher })
}

// create (post)
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    
    for (key of keys){
        if (req.body[key] == '') {
            return res.send('Please fill in all the fields.')
        }
    }

    let {avatar_url, birth_date, full_name, learning_type, degree, teaching_areas} = req.body

    birth_date = Date.parse(birth_date)
    const created_at = Date.now()
    const id = Number(data.teachers.length + 1)

    data.teachers.push({
        id,
        avatar_url,
        full_name,
        degree,
        learning_type,
        teaching_areas,
        birth_date,
        created_at,
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write file error!')
        return res.redirect('/teachers')
    })
}

// edit
exports.edit = function(req, res) {
    const {id} = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })
    
    if (!foundTeacher) return res.send ('Teacher not found!')

    const teacher = {
        ...foundTeacher,
        birth_date: date(foundTeacher.birth_date),
        id: Number(foundInstructor.id),
    }

    return res.render('teachers/edit', { teacher })
}

// put (update)
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){
        if (id == teacher.id){
            index = foundIndex
            return true
        }
    })

    if (!foundTeacher) return res.send ('Teacher not found!')

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth_date: Date.parse(req.body.birth_date),
    }

    data.teachers[index] = teacher

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Error on writing the file!')

        return res.redirect(`/teachers/${id}`)
    })
}

// delete
exports.delete = function(req, res){
    const { id } = req.body

    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('File write error!')

        return res.redirect('/teachers')
    })

}
