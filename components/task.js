import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { colorPalette } from '../assets/colors';
import { deleteImg, checked } from '../assets/images'

const Task = ({ todo, todos, setTodos }) => {

    const deleteHandler = () => {
        fetch('https://4ugzvhfkph.execute-api.eu-west-2.amazonaws.com/dev/todos/' + todo.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(() => setTodos(todos.filter((el) => el.id !== todo.id)))
            .catch((err) => console.error(err))
    };

    const doneHandler = () => {
        fetch('https://4ugzvhfkph.execute-api.eu-west-2.amazonaws.com/dev/todos/' + todo.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ done: !todo.done })
        })
            .then(() => {
                setTodos(todos.map(item => {
                    if (item.id === todo.id) {
                        return {
                            ...item, done: !item.done
                        };
                    }
                    return item;
                }))
            })
            .catch((err) => console.error(err))
    }

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <TouchableOpacity onPress={doneHandler}>
                    {
                        todo.done == true ?
                            (<Image style={styles.done} source={checked} />)
                            :
                            (<View style={styles.square}></View>)
                    }
                </TouchableOpacity>
                <Text style={styles.itemText}>{todo.task}</Text>
            </View>
            <TouchableOpacity style={styles.delete} onPress={deleteHandler}>
                <Image style={styles.delete} source={deleteImg} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: colorPalette.white,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: colorPalette.unchecked,
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15
    },
    done: {
        width: 24,
        height: 24,
        marginRight: 15
    },
    itemText: {
        maxWidth: '90%'
    },
    delete: {
        width: 24,
        height: 24
    }
})

export default Task;