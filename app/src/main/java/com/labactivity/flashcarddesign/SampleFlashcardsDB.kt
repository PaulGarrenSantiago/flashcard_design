package com.labactivity.flashcarddesign

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.labactivity.flashcarddesign.databinding.ActivitySampleFlashcardsBinding

class SampleFlashcardsDB : AppCompatActivity() {

    private lateinit var binding: ActivitySampleFlashcardsBinding
    private var isFront = true
    private var currentIndex = 0
    private val terms = arrayOf("Atomicity", "Column", "Commit", "Database", "Data Type", "Encryption", "Foreign Key", "Index", "Inner Join", "Join", "Key", "NoSQL")
    private val descriptions = arrayOf("The property of a transaction that guarantees that either all or none of the changes made by the transaction are written to the database.",
        "RDBMS tables store data in tables that are comprised of rows and columns. Each column is named. For example, first_name.",
        "The action that causes the all of the changes made by a particular transaction to be reliably written to the database files and made visible to other users.",
        "A structured set of data held in a computer, especially one that is accessible in various ways.",
        "The basic kind of data that can be stored in a column. The data types that are available in RDM SQL are: char, wchar, varchar, wvarchar, binary, varbinary, boolean, tinyint, smallint, integer, bigint, real, float, double, date, time, timestamp, long varbinary, long varchar, and long wvarchar.",
        "The encoding of data so that it cannot be understood by a human reader. This usually requires the use of an encryption key.",
        "One or more columns in a table intended to contain only values that match the related primary/unique key column(s) in the referenced table. Foreign and primary keys explicitly define the direct relationships between tables.",
        "A separate structure that allows fast access to a table’s rows based on the data values of the columns used in the index. RDM supports two indexing types: hash and b-tree. A SQL key (not foreign key) is implemented using an index.",
        "A join between two tables where only the rows with matching foreign and primary key values are returned.",
        "An operation in which the rows of one table are related to the rows of another through common column values.",
        "A column or columns on which an index is constructed to allow rapid and/or sorted access to a table’s row.",
        "A classification of data storage systems that are not primarily designed to be relationally accessed through the common SQL language. NoSQL systems are characterized by dynamic creation and deletion of key/value pairs and are structured to be highly scalable to multiple computers.")

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