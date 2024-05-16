package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.ActivitySampleFlashcards2Binding


class SampleFlashcards2 : AppCompatActivity() {

    private lateinit var binding: ActivitySampleFlashcards2Binding
    private var isFront = true
    private var currentIndex = 0
    private val terms = arrayOf("Variable", "Function", "Loop", "Class", "Array", "String", "Boolean", "Recursion", "Exception", "API (Application Programming Interface)")
    private val descriptions = arrayOf("A named storage location in a computer's memory that can hold data, and its value can be changed during program execution.",
        "A block of organized, reusable code that performs a specific task. It typically takes inputs, processes them, and returns a result.",
        "A programming construct that repeats a block of code until a specified condition is met. It allows for efficient repetition of tasks.",
        "A class is a blueprint for creating objects in object-oriented programming (OOP). It defines the properties and behaviors (methods) that all objects of that type will have.",
        "An array is a data structure that stores a fixed-size sequential collection of elements of the same type. Elements can be accessed by their index.",
        "A   sequence of characters, usually used to represent text, enclosed within quotation marks. String manipulation is a fundamental operation in programming.",
        "A data type that can have one of two values: true or false. It is often used in conditional statements and logical expressions.",
        "A programming technique in which a function calls itself directly or indirectly to solve a problem. It can lead to elegant and concise solutions but requires careful handling to avoid infinite loops.",
        "An event that occurs during the execution of a program that disrupts the normal flow of instructions. Exception handling allows programmers to respond to and manage unexpected errors gracefully.",
        "An API is a set of rules, protocols, and tools that allows different software applications to communicate with each other. It defines the methods and data formats for interaction between software components.")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySampleFlashcards2Binding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.textViewDefinition.visibility = View.INVISIBLE

        updateFlashcard(currentIndex)

        binding.flipBtn.setOnClickListener {
            flipCard()
        }
        binding.nextBtn.setOnClickListener{
            currentIndex = (currentIndex + 1) % terms.size
            updateFlashcard(currentIndex)
        }
        binding.backBtn.setOnClickListener {
            // Decrement index to show the previous term and definition
            currentIndex = (currentIndex - 1 + terms.size) % terms.size
            updateFlashcard(currentIndex)
        }
    }

    private fun flipCard() {
        if (isFront) {
            binding.textViewDefinition.visibility = View.VISIBLE
            binding.textViewTerm.visibility = View.INVISIBLE
            isFront = false
        } else {
            binding.textViewDefinition.visibility = View.INVISIBLE
            binding.textViewTerm.visibility = View.VISIBLE
            isFront = true
        }
    }


    private fun updateFlashcard(index: Int) {
        binding.textViewTerm.text = terms[index]
        binding.textViewDefinition.text = descriptions[index]
        // Show term and hide description by default
        binding.textViewTerm.visibility = View.VISIBLE
        binding.textViewDefinition.visibility = View.INVISIBLE

        // Increment index to show the page number starting from 1
        val pageNumber = index + 1
        binding.textViewCardNum.text = pageNumber.toString()
    }
}