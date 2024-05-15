package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.ActivitySampleFlashcardsBinding

class SampleFlashcards : AppCompatActivity() {

    private lateinit var binding: ActivitySampleFlashcardsBinding
    private var isFront = true
    private var currentIndex = 0
    private val terms = arrayOf("Kotlin", "Android Studio", "View Binding", "What are the 2 keywords for\n" + "declaring variables ?", "Null Safety", "Functions", "Smart Casts", "Data Classes", "Type Inference", "DSL (Domain-Specific Language) Support")
    private val descriptions = arrayOf("Kotlin is a programming language that makes coding concise, cross-platform, and fun. It is Google's preferred language for Android app development.",
                                       "Android app development. Android Studio provides the fastest tools for building apps on every Android device.",
                                       "It is a feature that makes the interaction of code with views easy. It generates a binding class for each XML layout.",
                                        "val - immutable\n" + "var - mutable",
                                        "Kotlin's feature that eliminates the risk of null pointer exceptions by distinguishing nullable and non-nullable types, ensuring safer code and reducing the likelihood of runtime crashes.",
                                        "Kotlin's mechanism that enables developers to add new functions to existing classes without modifying their source code, enhancing code reusability and allowing for concise syntax.",
                                        "Kotlin's feature that automatically casts types when certain conditions are met, eliminating the need for explicit type checks and casts in code, thereby improving readability and reducing boilerplate code.",
                                        "Kotlin's concise way of declaring classes solely to hold data, automatically generating standard methods such as equals(), hashCode(), and toString(), streamlining the creation of immutable data structures.",
                                        "Kotlin's ability to automatically deduce the data type of variables from the context, reducing the need for explicit type declarations and enhancing code readability without sacrificing type safety.",
                                        "Kotlin's flexibility in allowing developers to create concise and expressive domain-specific languages within the language itself, facilitating the creation of specialized syntax for specific problem domains, such as build scripts or HTML generation.")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySampleFlashcardsBinding.inflate(layoutInflater)
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